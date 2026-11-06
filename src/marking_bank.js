/**
 * src/marking_bank.js
 *
 * Interactive Digital Department Marking Bank & Model Explanations Portal
 * Allows Key Stage 3 pupils to self-check their 6-question printed booklet homework
 * from home via QR code without needing printed answer sheets in their booklet.
 */

// Embedded Great War Part 2 Knowledge Retrieval Companion Questions & Answers
const KS3_MARKING_DATA = {
  great_war_part2: {
    unitTitle: 'The Course of the Great War (1914–1918)',
    subtitle: 'Trench Warfare, Global Empire Troops, The Home Front & The Treaty of Versailles',
    enquiries: [
      {
        number: 1,
        title: '1. 1914 & The Rush to the Colours',
        shortTitle: '1914 & Colours',
        enquiryFocus: 'Why were young British men so desperate to volunteer for the slaughter of 1914?',
        questions: [
          {
            num: 1,
            tier: 'Bronze',
            q: 'Who appeared on famous recruitment posters pointing his finger with the slogan "Your Country Needs You"?',
            a: 'Lord Horatio Kitchener (Secretary of State for War)',
            exp: 'Kitchener predicted a long, grueling war requiring an army of millions, launching mass recruitment campaigns.',
          },
          {
            num: 2,
            tier: 'Bronze',
            q: 'What was the nickname given to battalions of friends, workmates, and neighbours who enlisted together in 1914?',
            a: 'Pals Battalions',
            exp: 'Units like the Accrington Pals and Grimsby Chums allowed men from the same town or factory to serve side-by-side.',
          },
          {
            num: 3,
            tier: 'Silver',
            q: 'Why did hundreds of thousands of young British men rush to enlist in August and September 1914?',
            a: 'A wave of patriotic enthusiasm, peer pressure, and the popular belief the war would be over by Christmas',
            exp: 'Young men viewed enlistment as an exciting adventure, an escape from mundane factory work, and a moral duty.',
          },
          {
            num: 4,
            tier: 'Silver',
            q: 'What symbol of cowardice was publicly handed to young men in civilian clothes on British streets?',
            a: 'A white feather',
            exp: 'The White Feather movement used public humiliation to shame men who had not enlisted into joining the army.',
          },
          {
            num: 5,
            tier: 'Gold',
            q: 'Why did the concept of "Pals Battalions" ultimately prove to be a catastrophic social tragedy?',
            a: 'Catastrophic casualties at the Somme wiped out an entire generation from specific towns on a single day',
            exp: 'When battalions were shattered on 1 July 1916, single communities lost hundreds of young men simultaneously, devastating northern towns.',
          },
          {
            num: 6,
            tier: 'Gold',
            q: 'How did the transition from a small professional army to a mass citizen army transform British society?',
            a: 'It made the war an inescapable national trauma touching every household and community across Britain',
            exp: 'The scale of bereavement transformed political expectations, sparking demands for universal voting rights and social welfare reform.',
          },
        ],
      },
      {
        number: 2,
        title: '2. Trench Warfare & The Haig Controversy (1915–1916)',
        shortTitle: 'Trenches & Haig',
        enquiryFocus: 'Did British generals make the horror of trench warfare worse, or was Haig trapped in an industrial learning curve?',
        questions: [
          {
            num: 7,
            tier: 'Bronze',
            q: 'Which weapon was responsible for approximately 60% of all combat casualties on the Western Front?',
            a: 'Heavy Artillery (high-explosive shells and shrapnel)',
            exp: 'Relentless artillery barrages pulverized trenches, caused catastrophic physical trauma, and induced severe shell shock.',
          },
          {
            num: 8,
            tier: 'Bronze',
            q: 'What painful medical condition was caused by soldiers standing in cold, waterlogged mud for days?',
            a: 'Trench Foot',
            exp: 'Prolonged exposure to damp mud caused fungal infection, numbness, and gangrene, often requiring amputation.',
          },
          {
            num: 9,
            tier: 'Silver',
            q: 'Why were frontline trenches constructed in a zig-zag or traverse pattern rather than straight lines?',
            a: 'To prevent enemy machine-gunners from firing along the whole trench and to contain artillery blast shockwaves',
            exp: 'The angular layout prevented enfilade fire and ensured that an artillery shell detonating in a trench contained its blast to a single bay.',
          },
          {
            num: 10,
            tier: 'Silver',
            q: 'Why did the week-long British artillery bombardment fail to destroy German defenses before the Somme in 1916?',
            a: 'A third of the shells were duds and deep German concrete bunkers protected troops underground',
            exp: 'When the bombardment lifted, German machine-gunners emerged from deep dugouts to mow down British infantry crossing No Man’s Land.',
          },
          {
            num: 11,
            tier: 'Gold',
            q: 'Why is Field Marshal Sir Douglas Haig remembered both as the "Butcher of the Somme" and the architect of victory?',
            a: 'Critics condemn his costly attrition tactics, while defenders argue he adapted modern technology to win in 1918',
            exp: 'Haig presided over 57,000 casualties on 1 July 1916, but later mastered combined-arms warfare in the decisive 1918 Hundred Days Offensive.',
          },
          {
            num: 12,
            tier: 'Gold',
            q: 'How did the development of tanks and creeping barrages eventually break the trench deadlock in 1918?',
            a: 'Combined-arms coordination crushed barbed wire and suppressed machine guns, restoring mobility',
            exp: 'Allied coordination of artillery, tanks, infantry, and aircraft replaced suicidal frontal charges with rapid mobile breakthroughs.',
          },
        ],
      },
      {
        number: 3,
        title: '3. Global Empire & The Forgotten Fronts (1914–1918)',
        shortTitle: 'Global Empire Fronts',
        enquiryFocus: 'Why were over four million colonial and dominion troops erased from popular memory?',
        questions: [
          {
            num: 13,
            tier: 'Bronze',
            q: 'Approximately how many Indian soldiers and labourers served the British Empire during the Great War?',
            a: 'Over 1.3 million Indian soldiers and personnel',
            exp: 'Indian regiments fought in the freezing mud of Ypres, in Mesopotamia (Iraq), and across the deserts of Palestine.',
          },
          {
            num: 14,
            tier: 'Bronze',
            q: 'What acronym was given to the Australian and New Zealand Army Corps who landed at Gallipoli in 1915?',
            a: 'The ANZACs',
            exp: 'The catastrophic Gallipoli campaign against the Ottoman Empire became a defining foundation of Australian and New Zealand national identity.',
          },
          {
            num: 15,
            tier: 'Silver',
            q: 'What strategic objective did Winston Churchill hope to achieve by attacking the Ottoman Empire at Gallipoli in 1915?',
            a: 'Knock the Ottoman Empire out of the war and open a Black Sea supply route to Russia',
            exp: 'Churchill sought an indirect maritime route to relieve pressure on the Western Front, but Ottoman forces pinned the Allies to the beaches.',
          },
          {
            num: 16,
            tier: 'Silver',
            q: 'Why were soldiers of the British West Indies Regiment often denied front-line combat roles?',
            a: 'Racial prejudice from British authorities restricted Black colonial troops to heavy labouring and ammunition loading',
            exp: 'Despite volunteering eagerly, colonial authorities feared training Black soldiers in combat arms would threaten postwar imperial rule.',
          },
          {
            num: 17,
            tier: 'Gold',
            q: 'Why was the global contribution of colonial and African troops largely erased from popular British memory after 1918?',
            a: 'Postwar imperial propaganda centered national remembrance exclusively on white European soldiers on the Western Front',
            exp: 'War memorials and histories celebrated British sacrifices in Flanders, sidelining the hundreds of thousands of African, Indian, and Caribbean troops.',
          },
          {
            num: 18,
            tier: 'Gold',
            q: 'How did participation in the Great War accelerate demands for national independence across the British Empire?',
            a: 'Colonial troops who fought for "freedom in Europe" returned home demanding equal political self-determination',
            exp: 'Sacrifices made by Indian and African soldiers undermined European claims of racial superiority and catalyzed early anti-colonial movements.',
          },
        ],
      },
      {
        number: 4,
        title: '4. The Home Front & Women’s Total War (1914–1918)',
        shortTitle: 'Home Front & Women',
        enquiryFocus: 'How far did the First World War transform the British state and daily life on the Home Front?',
        questions: [
          {
            num: 19,
            tier: 'Bronze',
            q: 'What landmark law passed in August 1914 gave the British government sweeping emergency powers over daily life?',
            a: 'DORA (Defence of the Realm Act)',
            exp: 'DORA permitted the government to censor newspapers, take over factories, nationalize railways, and dilute beer.',
          },
          {
            num: 20,
            tier: 'Bronze',
            q: 'What nickname was given to female munitions workers whose skin turned yellow from handling toxic TNT chemicals?',
            a: '"Canary Girls"',
            exp: 'Toxic exposure to sulphuric acid and TNT stained skin yellow, damaged lungs, and caused early miscarriages in munitions plants.',
          },
          {
            num: 21,
            tier: 'Silver',
            q: 'Why was compulsory conscription introduced for unmarried British men aged 18 to 41 in January 1916?',
            a: 'Voluntary enlistment collapsed while devastating casualties on the Western Front created an acute manpower shortage',
            exp: 'The bloody slaughter at Neuve Chapelle and Loos exhausted the volunteer army, forcing Prime Minister Asquith to pass the Military Service Act.',
          },
          {
            num: 22,
            tier: 'Silver',
            q: 'Why did the British government introduce compulsory food rationing for sugar, butter, and meat in early 1918?',
            a: 'German Unrestricted Submarine Warfare sank merchant ships, causing severe civilian food shortages and panic buying',
            exp: 'U-boats sank hundreds of cargo vessels in the Atlantic, threatening Britain with starvation until rationing ensured equitable food sharing.',
          },
          {
            num: 23,
            tier: 'Gold',
            q: 'How did women’s wartime work permanently shatter traditional Victorian gender stereotypes?',
            a: 'Women could capably perform heavy industrial labor, operate machinery, and sustain the war economy',
            exp: 'Nearly a million women worked in munitions, transport, and agriculture, disproving Victorian arguments that women were physically and mentally frail.',
          },
          {
            num: 24,
            tier: 'Gold',
            q: 'To what extent did women’s war work directly lead to women gaining the parliamentary vote in 1918?',
            a: 'It created an undeniable moral debt, though the 1918 Act granted votes only to women over 30 with property',
            exp: 'Politicians could not deny the vote to women who saved the nation, but established older age thresholds to avoid a female voting majority.',
          },
        ],
      },
      {
        number: 5,
        title: '5. The Treaty of Versailles & The Flawed Peace (1918–1919)',
        shortTitle: 'Versailles & Flawed Peace',
        enquiryFocus: 'Did the Treaty of Versailles solve the problems of 1914, or create the nightmares of 1939?',
        questions: [
          {
            num: 25,
            tier: 'Bronze',
            q: 'In what famous hall was the Treaty of Versailles signed on 28 June 1919, exactly five years after the assassination at Sarajevo?',
            a: 'The Hall of Mirrors in the Palace of Versailles',
            exp: 'The French deliberately chose the Hall of Mirrors where the German Empire had been proclaimed in 1871 after France’s defeat in the Franco-Prussian War.',
          },
          {
            num: 26,
            tier: 'Bronze',
            q: 'What controversial clause in the Treaty of Versailles (Article 231) forced Germany to accept sole moral blame for causing the war?',
            a: 'The "War Guilt" Clause (Article 231)',
            exp: 'Article 231 provided the legal justification for the Allies to demand massive financial reparations to compensate for civilian damages.',
          },
          {
            num: 27,
            tier: 'Silver',
            q: 'What staggering sum of financial reparations did the Inter-Allied Reparations Commission set for Germany to pay in 1921?',
            a: '£6.6 billion (132 billion gold marks)',
            exp: 'British economist John Maynard Keynes resigned from the peace delegation in protest, warning this unpayable sum would ruin the European economy.',
          },
          {
            num: 28,
            tier: 'Silver',
            q: 'Why did German politicians and the public universally denounce the Treaty of Versailles as an unfair "Diktat"?',
            a: 'Germany was entirely excluded from negotiations and forced to sign under threat of an immediate Allied military invasion',
            exp: 'The German delegation was presented with a completed draft and given just three weeks to submit written objections before being ordered to sign.',
          },
          {
            num: 29,
            tier: 'Gold',
            q: 'How did the military restrictions of Versailles aim to prevent Germany from ever launching an offensive war again?',
            a: 'The army was capped at 100,000 volunteers, conscription was banned, tanks and warplanes were prohibited, and the Rhineland was demilitarised',
            exp: 'These terms reduced Germany’s military to a domestic border security force, though right-wing nationalists deeply resented the disarmament.',
          },
          {
            num: 30,
            tier: 'Gold',
            q: 'Why did British political cartoonist Will Dyson portray a weeping toddler labeled "1940 Class" outside the Versailles peace conference?',
            a: 'He prophetically warned that the punitive terms would breed resentment, leading children born in 1919 to fight another world war by 1940',
            exp: 'Dyson’s cartoon, "Peace and Future Cannon Fodder", showed Georges Clemenceau saying "Curious! I seem to hear a child weeping!", predicting World War II.',
          },
        ],
      },
    ],
  },
};

export function renderDepartmentMarkingBank(container, unitId, unitData = {}) {
  const data = KS3_MARKING_DATA[unitId] || {
    unitTitle: unitData.title || 'Key Stage 3 Unit',
    subtitle: 'Department Knowledge Retrieval Marking Bank',
    enquiries: [],
  };

  const totalQuestions = data.enquiries.reduce((acc, e) => acc + e.questions.length, 0);

  container.innerHTML = `
    <div class="marking-bank-portal" style="max-width: 1100px; margin: 0 auto; padding: 20px 16px 60px 16px; font-family: Inter, sans-serif;">
      
      <!-- Top Header Masthead -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 26px 30px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="font-size: 0.78rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-clipboard-check"></i> <span>Digital Department Marking Bank & Model Explanations</span>
          </div>
          <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.95rem; font-weight: 900; line-height: 1.2; color: #ffffff;">
            ${data.unitTitle}
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 0.92rem; color: #94a3b8; max-width: 650px;">
            Self-check your printed booklet homework questions with verified model answers and causal explanations.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="/?view=reading&unit=${unitId}" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-book-open-reader" style="color: #f472b6;"></i> <span>Literary Companion</span>
          </a>
          <a href="/?view=lessons&unit=${unitId}" class="btn" style="background: #2563eb; color: #ffffff; border: 1px solid #3b82f6; font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-chalkboard-user"></i> <span>Unit Lessons</span>
          </a>
        </div>
      </div>

      <!-- Cognitive Guidance Strip -->
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-bottom: 24px; font-size: 0.9rem; color: #1e3a8a; line-height: 1.5;">
        <strong><i class="fa-solid fa-lightbulb"></i> How to use this Self-Checking Marking Bank:</strong> Compare what you wrote in black ink on your printed retrieval pages against the model answers below. For full marks, ensure your answer contains both the <strong>Core Historical Fact</strong> and the <strong>Causal Mechanism / Detail</strong>. Record your final score out of 6 on your booklet front cover!
      </div>

      <!-- Enquiries Filter Tabs -->
      <div id="marking-tabs" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
        <button type="button" class="btn marking-filter-btn" data-enquiry="all" style="padding: 8px 16px; font-size: 0.88rem; font-weight: 700; background: #1e3a8a; color: #ffffff; border: 1.5px solid #1e3a8a; border-radius: 6px; cursor: pointer;">
          All Enquiries (${totalQuestions} Questions)
        </button>
        ${data.enquiries
          .map(
            (e) => `
          <button type="button" class="btn marking-filter-btn" data-enquiry="${e.number}" style="padding: 8px 14px; font-size: 0.88rem; font-weight: 700; background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
            Enquiry ${e.number}: ${e.shortTitle}
          </button>
        `,
          )
          .join('')}
      </div>

      <!-- Questions List Container -->
      <div id="marking-questions-container" style="display: flex; flex-direction: column; gap: 24px;">
        ${data.enquiries
          .map(
            (enq) => `
          <div class="marking-enquiry-section" data-enquiry-id="${enq.number}" style="background: #ffffff; border-radius: 10px; border: 1.5px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="background: #f8fafc; padding: 16px 20px; border-bottom: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; background: #1e3a8a; color: #ffffff; padding: 2px 8px; border-radius: 4px;">
                  Enquiry ${enq.number}
                </span>
                <h3 style="margin: 4px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; font-weight: 800; color: #0f172a;">
                  ${enq.title}
                </h3>
              </div>
              <span style="font-size: 0.82rem; font-weight: 600; color: #64748b; font-style: italic;">
                ${enq.enquiryFocus}
              </span>
            </div>

            <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
              ${enq.questions
                .map((q) => {
                  const tierColor =
                    q.tier === 'Bronze' ? '#059669' : q.tier === 'Silver' ? '#d97706' : '#dc2626';
                  const tierBg =
                    q.tier === 'Bronze' ? '#ecfdf5' : q.tier === 'Silver' ? '#fffbeb' : '#fef2f2';
                  return `
                  <div class="marking-question-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; background: #ffffff;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                      <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <span style="font-weight: 900; color: #1e3a8a; font-size: 1.05rem; min-width: 24px;">Q${q.num}.</span>
                        <div style="font-weight: 700; color: #1e293b; font-size: 0.98rem; line-height: 1.45;">
                          ${q.q}
                        </div>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: ${tierBg}; color: ${tierColor}; border: 1px solid ${tierColor}40; padding: 2px 8px; border-radius: 4px; white-space: nowrap;">
                        ${q.tier}
                      </span>
                    </div>

                    <details style="margin-top: 10px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; padding: 10px 14px;">
                      <summary style="font-weight: 700; font-size: 0.86rem; color: #2563eb; cursor: pointer; user-select: none;">
                        <i class="fa-solid fa-eye"></i> Click to Reveal Model Answer & Historical Explanation
                      </summary>
                      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 0.92rem; line-height: 1.55;">
                        <div style="margin-bottom: 6px;">
                          <strong style="color: #15803d; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.5px; display: block;">Approved Core Fact:</strong>
                          <span style="font-weight: 700; color: #0f172a;">${q.a}</span>
                        </div>
                        <div>
                          <strong style="color: #475569; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.5px; display: block;">Historical Mechanism & Context:</strong>
                          <span style="color: #334155;">${q.exp}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>

      <!-- Disciplinary Pathways Reference Card -->
      <div style="margin-top: 36px; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <h3 style="margin: 0 0 14px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-stairs" style="color: #1e3a8a;"></i> KS3 Level Assessment Pathways
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #94a3b8;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #475569; margin-bottom: 4px;">EMERGING (1–2 / 6)</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">Recalls standalone historical dates, names, and basic vocabulary terms.</p>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #1e40af; margin-bottom: 4px;">DEVELOPING (3–4 / 6)</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">Explains cause and consequence using because/as a result connectives.</p>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #059669;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #065f46; margin-bottom: 4px;">SECURING (5 / 6)</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">Demonstrates deep contextual understanding and links multiple causal factors.</p>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #d97706;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #92400e; margin-bottom: 4px;">GREATER DEPTH (6 / 6)</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">Evaluates synoptic turning points and explains long-term historical significance.</p>
          </div>
        </div>
      </div>

    </div>
  `;

  // Wire Enquiry Filter Buttons
  const filterBtns = container.querySelectorAll('.marking-filter-btn');
  const sections = container.querySelectorAll('.marking-enquiry-section');

  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      const enq = btn.dataset.enquiry;
      filterBtns.forEach((b) => {
        b.style.background = '#ffffff';
        b.style.color = '#334155';
        b.style.borderColor = '#cbd5e1';
      });
      btn.style.background = '#1e3a8a';
      btn.style.color = '#ffffff';
      btn.style.borderColor = '#1e3a8a';

      sections.forEach((sec) => {
        if (enq === 'all' || sec.dataset.enquiryId === enq) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    };
  });
}

