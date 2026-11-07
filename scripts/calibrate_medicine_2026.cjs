const fs = require('fs');
const path = require('path');

// Read existing mock_exam_bank_data.js
const mockBankPath = path.join(__dirname, '../src/engine/mock_exam_bank_data.js');
let mockBankCode = fs.readFileSync(mockBankPath, 'utf8');

// The June 2026 calibrated questions for Medicine:
const med26Questions = {
  // Lesson 5.4: RAMC & Evacuation Chain
  lesson_5_4: [
    {
      id: "med26_q1a_ccs",
      mockId: "med_june_2026_live",
      qCode: "1(a)",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "2-Mark Feature Drill",
      marks: 2,
      targetMins: 3,
      questionText: "Describe one feature of a Casualty Clearing Station (CCS) on the Western Front.",
      stimulus: [],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Marker Guidance</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>Reward:</strong> Triage system (3 tiers), surgical facilities (operating rooms to prevent gangrene), mobile X-ray units, bed capacity (200–500 expanding to thousands), or location situated <em>several miles behind the front line</em> (out of artillery range, near transport lines).<br><strong>DO NOT REWARD (Zero Credit):</strong> Stating that the CCS was "on the frontline" or in the trenches (a geographical error confusing CCS with RAP).</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 1 Model (1/2 Marks — Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">1 Mark</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.5; font-style: italic;">
      "One feature of a Casualty Clearing Station was that it treated soldiers who were wounded in battle."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Note:</strong> Identifies that it treated casualties, but provides no specific supporting detail, clinical function, or operational feature of a CCS (1/2 marks).
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 2 Model (2/2 Marks — Grade 9 Exemplar)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (2/2)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.6;">
      <strong>Feature:</strong> Casualty Clearing Stations operated a strict clinical triage system to prioritize incoming wounded based on medical urgency.<br>
      <strong>Detail:</strong> Medical officers divided casualties into three categories: the walking wounded, those in need of immediate surgery (to stop fatal haemorrhage or gas gangrene), and moribund cases given palliative comfort care, ensuring surgical teams operated on patients with the greatest chance of survival.
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this scores Full Marks:</strong> Clear feature identified + precise supporting detail explaining the 3 triage categories and clinical purpose.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    },
    {
      id: "med26_q2a_utility",
      mockId: "med_june_2026_live",
      qCode: "2(a)",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "8-Mark Source Utility",
      marks: 8,
      targetMins: 14,
      questionText: "Study Sources A and B in the Sources Booklet. How useful are Sources A and B for an enquiry into the problems of transporting the wounded along the chain of evacuation on the Western Front? Explain your answer, using Sources A and B and your knowledge of the historical context.",
      stimulus: [],
      sourceExtract: `<div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="background: #fdfbf7; border: 1.5px solid #e2d9cc; border-left: 4px solid #b45309; border-radius: 8px; padding: 14px 18px;">
          <div style="font-weight: 800; color: #b45309; margin-bottom: 4px; text-transform: uppercase; font-size: 0.82rem;">Source A: From the diary of Edward Munro, 7 November 1916</div>
          <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 8px; font-style: italic;">Munro was a stretcher bearer on the Western Front. Here he is describing his work during the Battle of the Somme.</div>
          <div style="font-style: italic; color: #1e293b; line-height: 1.55; font-size: 0.92rem;">
            "The Sergeant in charge ordered us to stay and help his team, as there were many casualties and he did not have enough stretcher bearers. After a short rest, we started to carry the wounded and there were a large number of them. The soldiers had made an attack on the German line the previous night and had suffered many casualties. The land over which we carried the wounded is very difficult to cross, as it has many waterlogged shell holes. We were constantly shelled by the Germans. Yesterday, two stretcher bearers had been killed. Carrying the wounded is very difficult at night. The landmarks which guide us in the daytime are not visible at night, meaning it is easy to get lost. We are covered in mud, have sore feet and are tired."
          </div>
        </div>

        <div style="background: #fdfbf7; border: 1.5px solid #e2d9cc; border-left: 4px solid #1e3a8a; border-radius: 8px; padding: 14px 18px;">
          <div style="font-weight: 800; color: #1e3a8a; margin-bottom: 4px; text-transform: uppercase; font-size: 0.82rem;">Source B: Official War Photograph published in the Daily Mail (July 1916)</div>
          <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 8px; font-style: italic;">An official war photograph showing British soldiers pushing a motorised ambulance through deep mud during the Battle of the Somme, July 1916.</div>
          <div style="text-align: center; margin: 10px 0;">
            <img src="/images/med26/source_b_ambulance_somme_1916.jpg" alt="Source B: Soldiers pushing motorised ambulance on the Somme" style="max-height: 250px; border-radius: 6px; border: 1px solid #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: inline-block;">
          </div>
          <div style="font-size: 0.8rem; color: #64748b; text-align: center;">Official War Photograph / Daily Mail National Press Series (CBW / Alamy / Crown Copyright Expired).</div>
        </div>
      </div>`,
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Rules (AO3 Best-Fit)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1. Zero Comparison Rule:</strong> Do NOT compare Source A and B; they are marked independently.<br><strong>2. The 'No-Knowledge' Trap (Level 2 Ceiling):</strong> Evaluating provenance without deploying qualitative historical knowledge caps the answer at Level 2 (max 5 marks).<br><strong>3. Level 3 Benchmark:</strong> Content AND provenance of both sources evaluated with precise contextual knowledge (e.g. 57,000 casualties on day 1 of the Somme, waterlogged craters requiring 6–8 bearers per stretcher, heavy ambulance chassis bogged down in mud).</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 2 Model (4/8 Marks — Grade 5 Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">4/8 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "Source A is quite useful because it tells us that stretcher bearers had a hard time. It says the sergeant ordered them to help because 'he did not have enough stretcher bearers' and the ground had 'waterlogged shell holes'. It also says they were shelled by the Germans and two stretcher bearers died. This is useful because it comes from a diary written at the time by Edward Munro who was actually there, so it is honest and not exaggerated because diaries are private.<br><br>Source B is also useful because it is an official photograph showing soldiers pushing a motor ambulance that is stuck in the mud. This shows that motor transport was a problem on the Western Front. However, because it was published in the Daily Mail, it might be propaganda to make the public feel sorry for the soldiers, so it might be biased.<br><br>Overall, I think Source A is more useful than Source B because Source A is a private diary describing personal feelings, whereas Source B is just a photograph that could be staged."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Commentary (Why Capped at Level 2):</strong> Quotes source details and identifies source types, but falls squarely into the <em>'No-Knowledge Trap'</em> (no specific contextual knowledge like casualty statistics or bearer ratios). Provenance comments rely on generic clichés (<em>'private diary so it is honest'</em>, <em>'newspaper so it is biased/propaganda'</em>). Wasted time making an irrelevant comparison between A and B.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 3 Model (8/8 Marks — Grade 8/9 Exemplary)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (8/8)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.65;">
      Source A is exceptionally useful for an enquiry into casualty evacuation because it provides firsthand evidence of the acute manpower shortages and severe physical hazards facing stretcher bearers on the Somme. Munro notes that the team had 'not enough stretcher bearers' following an attack with heavy casualties, and that transit was impeded by 'waterlogged shell holes' and German artillery bombardment. This strongly corroborates historical context: during the Battle of the Somme (July–November 1916), British forces suffered over 400,000 casualties, including 57,000 on the first day alone. The sheer volume of wounded utterly overwhelmed the Regimental Aid Posts, while relentless artillery churned the clay subsoil into deep quagmires. In these conditions, traversing shattered trenches and shell craters often required six to eight bearers per stretcher rather than the standard two, exhausting bearer squads and creating lethal delays in reaching Casualty Clearing Stations. As a private diary entry written during active service, Munro had no motive to sanitize the operational crisis for public consumption; its utility lies in capturing the raw physical exhaustion ('covered in mud, have sore feet') and navigational disorientation of night evacuations under fire, though it reflects the localized conditions of a single bearer squad in late 1916.<br><br>Source B is equally valuable for demonstrating the technological and infrastructural limitations of motorized casualty evacuation along the chain of evacuation. The photograph shows a motorized field ambulance bogged down to its axles in deep mud, requiring multiple soldiers to physically push the vehicle. This directly aligns with contextual knowledge of the Western Front transport system: although the British Red Cross and RAMC introduced motorized ambulances in late 1914 to replace horse-drawn wagons, the heavy motor chassis and narrow solid tires were frequently paralyzed by the impassable mud of the Somme and Ypres salients. Consequently, wounded men suffering from haemorrhage or compound fractures suffered agonizing transit delays or severe jolting that worsened traumatic shock, forcing the RAMC to rely heavily on horse-drawn ambulances across forward zones and hospital barges along inland waterways. The provenance of Source B enhances its utility: as an official war photograph published in the Daily Mail, British military censors permitted its publication to demonstrate the heroic resolve and teamwork of soldiers overcoming atrocious conditions. While official press photos avoided displaying mutilated corpses, this image authentically captures the genuine logistical nightmare of mud immobilizing mechanized transport on the Western Front.
    </div>
    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this secures Full Marks (8/8):</strong> Evaluates content and provenance of both sources independently. Contextual knowledge is qualitative and accurate (57,000 Somme casualties, 6–8 bearers per stretcher, motor chassis vs horse/barge mechanics). Zero comparative waste.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    },
    {
      id: "med26_q2b_followup",
      mockId: "med_june_2026_live",
      qCode: "2(b)",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "4-Mark Follow-up Enquiry",
      marks: 4,
      targetMins: 5,
      questionText: "Study Source A. How could you follow up Source A to find out more about the problems of transporting the wounded along the chain of evacuation on the Western Front? In your answer, you must give the question you would ask and the type of source you could use. Complete the table below.",
      stimulus: [],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Rules (Q2b 4-Part Precision)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>Part (a) Detail:</strong> Must select a valid detail from Source A on transport problems.<br><strong>Part (b) Question:</strong> Must directly investigate the wider enquiry (problems of transporting wounded). Questions on treatments or wounds score 0.<br><strong>Part (c) Source Type:</strong> Must name an existing, specific historical record. Writing <em>'RAMC records'</em> or <em>'Conduct an interview'</em> scores 0.<br><strong>Part (d) Explanation:</strong> Must explain how the source answers the specific question.</p>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px;">
    <div style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.82rem; margin-bottom: 10px;"><i class="fa-solid fa-star"></i> Full Mark Exemplar Model (4/4 Marks)</div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.6;">
      <strong>Detail in Source A that I would follow up:</strong><br>
      <em>"The land over which we carried the wounded is very difficult to cross, as it has many waterlogged shell holes... Carrying the wounded is very difficult at night."</em><br><br>
      <strong>Question I would ask:</strong><br>
      What specific logistical adaptations, such as duckboard tracks, bearer relay posts, or light trench railways, did the RAMC introduce in 1916–1917 to reduce casualty transit times across mud-soaked battlefields?<br><br>
      <strong>What type of source I could use:</strong><br>
      The War Diaries of an RAMC Field Ambulance unit or the operational reports of the Director General of Army Medical Services (DGAMS) on the Somme.<br><br>
      <strong>How this might help answer my question:</strong><br>
      These records would provide official timings, logistics maps, and medical officers' evaluations showing whether engineered trackways or stretcher relay systems successfully accelerated casualty evacuation from Regimental Aid Posts to Casualty Clearing Stations.
    </div>
    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Examiner Note:</strong> Complete 4/4 marks awarded. Detail is directly quoted; question is targeted; source avoids the disqualified "RAMC records" trap; explanation directly demonstrates historical utility.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    }
  ],

  // Lesson 5.5: Medical Advances & Western Front Experiments
  lesson_5_5: [
    {
      id: "med26_q1b_blood_storage",
      mockId: "med_june_2026_live",
      qCode: "1(b)",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "2-Mark Feature Drill",
      marks: 2,
      targetMins: 3,
      questionText: "Describe one feature of developments in the storage of blood on the Western Front.",
      stimulus: [],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Marker Guidance</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>Reward:</strong> Chemical anticoagulants (sodium citrate 1914, citrate-glucose 1916), cooling/refrigeration (ice chests), sterile glass storage bottles, or the first blood bank at Cambrai (Oswald Robertson 1917).<br><strong>DO NOT REWARD (Zero Credit):</strong> General blood transfusion knowledge (e.g. Landsteiner blood groups or direct syringe transfusions) <em>without an explicit link to blood storage</em>.</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 1 Model (1/2 Marks — Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">1 Mark</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.5; font-style: italic;">
      "One feature was that doctors gave wounded soldiers blood transfusions so they wouldn't bleed to death."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Note:</strong> Mentions blood transfusion generally but contains no link to the <em>storage</em> of blood. General transfusion without mentioning anticoagulants, cooling, or blood banks cannot score the second mark (1/2 marks).
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 2 Model (2/2 Marks — Grade 9 Exemplar)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (2/2)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.6;">
      <strong>Feature:</strong> The addition of chemical anticoagulants enabled blood to be preserved and stored in advance rather than transferred directly person-to-person.<br>
      <strong>Detail:</strong> In 1916, Francis Rous and James Turner discovered that adding citrate-glucose prevented coagulation, allowing refrigerated blood to be stored in sterile glass bottles for up to four weeks, which enabled Captain Oswald Robertson to create the first forward blood bank for the Battle of Cambrai in 1917.
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this scores Full Marks:</strong> Chemical preservation identified + precise supporting detail on citrate-glucose and Oswald Robertson's 1917 Cambrai blood bank. Fully addresses the storage criterion.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    }
  ],

  // Lesson 2.3: Renaissance Prevention & The Great Plague (1665)
  lesson_2_3: [
    {
      id: "med26_q3_prevention",
      mockId: "med_june_2026_live",
      qCode: "3",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "4-Mark Difference",
      marks: 4,
      targetMins: 6,
      questionText: "Explain one way in which the prevention of infectious diseases in the Renaissance period (c1500–c1700) was different from the prevention of infectious diseases in the eighteenth and nineteenth centuries (c1700–c1900).",
      stimulus: [],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Rules (Q3 Dual-Period Requirement)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>The Single-Period Trap:</strong> Answers providing detailed knowledge of only ONE period are strictly capped at 2 marks. Full marks (4/4) require an explicit explanation of difference supported by accurate historical evidence from BOTH periods.</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 1 Model (2/4 Marks — Grade 4/5)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">2/4 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "One way prevention was different was that in the eighteenth and nineteenth centuries they had vaccinations. Edward Jenner discovered the smallpox vaccine in 1796 by using cowpox from a milkmaid named Sarah Nelmes. The British government then made smallpox vaccination compulsory in 1853, which stopped thousands of people from dying of smallpox."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Note (Why Capped):</strong> Gives strong 19th-century knowledge (Jenner 1796, 1853 Act), but gives ZERO detail about the Renaissance period (c1500–c1700). Under Edexcel rules, omitting one period caps the answer at Level 1, 2 marks.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 2 Model (4/4 Marks — Grade 8/9 Exemplary)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (4/4)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.65;">
      One decisive way prevention was different was that Renaissance prevention relied on <strong>supernatural appeals and miasma-clearing measures</strong>, whereas eighteenth and nineteenth-century prevention used <strong>biological immunisation and government-mandated sanitary infrastructure</strong>.<br><br>
      In the Renaissance (c1500–c1700), people still lacked knowledge of pathogens. During epidemics like the 1665 Great Plague, preventative efforts focused on warding off bad air by burning barrels of pitch and carrying sweet-smelling pomanders, alongside religious fasts and locking infected families in their homes under red crosses. In stark contrast, during the eighteenth and nineteenth centuries (c1700–c1900), prevention became scientifically targeted. In 1796, Edward Jenner developed the first biological vaccine by demonstrating that inoculation with cowpox conferred immunity against deadly smallpox, leading Parliament to make vaccination compulsory in 1853. Furthermore, following John Snow’s 1854 discovery that cholera was waterborne and Louis Pasteur’s 1861 Germ Theory, the Public Health Act of 1875 legally required local authorities to build clean water pipelines and Joseph Bazalgette’s enclosed sewer systems, preventing infectious microbes from entering drinking supplies. Therefore, Renaissance prevention focused on masking bad smells and isolating victims, whereas nineteenth-century prevention scientifically blocked transmission through vaccination and sanitation.
    </div>
    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this scores Full Marks:</strong> AO2 establishes a sharp conceptual difference; AO1 provides rich, specific evidence from both eras (1665 plague orders/pomanders vs Jenner 1796, 1853 Vaccination Act, Snow/Pasteur, 1875 Public Health Act).
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    }
  ],

  // Lesson 3.3: Hospital Care, Florence Nightingale & Surgery Advances
  lesson_3_3: [
    {
      id: "med26_q4_hospitals",
      mockId: "med_june_2026_live",
      qCode: "4",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "12-Mark Causation",
      marks: 12,
      targetMins: 20,
      questionText: "Explain why hospital care and treatment improved in the period c1700–c1900. You may use the following in your answer: the Nightingale School for Nurses; antiseptics. You must also use information of your own.",
      stimulus: [
        "the Nightingale School for Nurses",
        "antiseptics"
      ],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Rules (The Rigid 3-Aspects Ceiling)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>The 3-Aspects Rule:</strong> Candidates MUST address at least <strong>three distinct aspects of content</strong> to access Level 4 (10–12 marks). Covering only the two stimulus points caps the response at Level 3. No introduction or conclusion is required; causes do not need to be prioritized.</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 2 Model (5/12 Marks — Grade 5 Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">5/12 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "Hospital care improved a lot between 1700 and 1900 because of Florence Nightingale. Before Nightingale, hospitals were dirty and dangerous places where nurses were untrained. Florence Nightingale went to the Crimean War in 1854 and cleaned up Scutari hospital. She made nurses wash their hands, cleaned the wards, gave patients fresh food and clean bandages, and mortality dropped from 40% to 2%. When she returned to Britain, she published Notes on Nursing in 1859 and set up the Nightingale School for Nurses at St Thomas' Hospital in 1860. This improved hospitals because nurses became professional and hospitals were much cleaner.<br><br>Another reason hospital treatment improved was antiseptics. Joseph Lister read Louis Pasteur's Germ Theory and realised that microbes caused gangrene and sepsis in wounds. In 1867, he invented the carbolic acid spray, which he sprayed on wounds, dressings, and instruments. This reduced infection rates from 46% to 15%. Patients were much safer having surgery in hospitals because they did not catch hospital gangrene."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Commentary (Why Capped):</strong> Covers the two stimulus points with good narrative detail. However, because it addresses only TWO aspects of content and provides no third dimension (such as pavilion architecture, anaesthetics, or voluntary hospitals), it is strictly barred from accessing Level 4 under the 3-aspect ceiling rule.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 4 Model (12/12 Marks — Grade 8/9 Exemplary)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (12/12)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.65;">
      One decisive reason hospital care improved was the professionalisation of nursing led by Florence Nightingale, which transformed hospitals from unhygienic death-traps into clean, disciplined clinical environments. In the early eighteenth century, hospitals were notorious for high mortality rates, with untrained nurses neglecting basic hygiene. Drawing on her experiences in the Crimean War (1854), Nightingale published her influential <em>Notes on Nursing</em> (1859) and established the Nightingale School for Nurses at St Thomas’ Hospital in London in 1860. Nightingale instituted rigorous training regimens grounded in strict sanitary discipline, patient observations, and regular wound cleaning. By elevating nursing into a respected, highly trained profession, Nightingale ensured that ward care was systematic and sterile, directly reducing cross-infection and establishing standard hygienic protocols across British voluntary hospitals.<br><br>
      Furthermore, hospital care was dramatically improved through radical architectural reforms and sanitary engineering, specifically the adoption of the 'pavilion plan'. In her 1859 work <em>Notes on Hospitals</em>, Nightingale argued that cramped, stagnant wards trapped foul air and promoted infectious disease. Consequently, new Victorian hospitals—such as the rebuilt St Thomas' Hospital in 1871—were constructed using the pavilion system: separate, detached multi-storey pavilion wings connected by well-ventilated corridors. These wards featured large, opposite-facing windows to maximize fresh airflow and natural daylight, separate isolation wards for infectious fever patients, and smooth, non-porous tiled floors and walls that could be washed down with disinfectants. By separating disease categories and eliminating overcrowded, poorly ventilated spaces, pavilion architecture dramatically lowered secondary infection rates and created the structural framework for modern clinical recovery.<br><br>
      Finally, hospital surgical treatment was revolutionized by the twin breakthroughs of anaesthetics and antiseptic/aseptic surgery, transforming surgical wards from chambers of agony into sterile operating environments. Prior to the mid-nineteenth century, operations were severely limited by pain and postoperative sepsis ('hospital gangrene'). In 1847, James Simpson discovered the effective anaesthetic properties of chloroform, which eliminated agony and traumatic shock, allowing surgeons to operate deeper inside the human body with precision rather than reckless speed. Building on this and Pasteur's 1861 Germ Theory, Joseph Lister introduced carbolic acid spray in 1867 to sterilize surgical instruments, ligatures, and operative incisions, slashing postoperative infection mortality from 46% to 15%. By the 1890s, Lister’s chemical antisepsis evolved into comprehensive 'aseptic surgery' pioneered by Ernst von Bergmann and William Halsted, utilizing autoclaves to steam-sterilize instruments, sterile rubber gloves, sterilized surgical gowns, and air-filtered operating theatres. This eliminated airborne pathogens altogether, ensuring patients could undergo complex hospital operations without dying of fatal bacterial contamination.
    </div>
    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this secures Level 4 (Full Marks):</strong> Flawlessly deploys THREE distinct aspects of content: 1. Nightingale nursing professionalization; 2. Pavilion plan architectural sanitation; 3. Anaesthetic and antiseptic/aseptic surgery (Simpson, Lister, Bergmann, Halsted). Sustained causal explanation throughout.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    }
  ],

  // Lesson 1.1: Medieval Supernatural & Religious Explanations
  lesson_1_1: [
    {
      id: "med26_q5_medieval_religion",
      mockId: "med_june_2026_live",
      qCode: "5",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "16-Mark Judgement Essay",
      marks: 16,
      targetMins: 25,
      questionText: "'In the medieval period (c1250–c1500), ideas about the cause of illness were mainly based on religion.' How far do you agree? Explain your answer. You may use the following in your answer: the Church; miasma. You must also use information of your own. [16 marks + 4 SPaG = 20 marks]",
      stimulus: [
        "the Church",
        "miasma"
      ],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Rules (Q5/Q6 Judgement Essays)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1. Three Aspects Required for Level 4:</strong> Must deploy at least three aspects of content (e.g. Church/religion, miasma/astrology, Four Humours/rational).<br><strong>2. Judgement:</strong> Can be conveyed internally through paragraph evaluation; separate conclusion not mandatory.<br><strong>3. SPaG (4 Marks):</strong> Requires accurate deployment of specialist historical terms (etiology, hegemony, phlebotomy, miasma, monotheism).</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 2 Model (6/16 Marks — Grade 5 Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">6/16 + 3 SPaG = 9/20</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "I agree with the statement that ideas about the cause of illness in the medieval period were mainly based on religion. In the medieval period, the Catholic Church was very powerful and everyone went to church. Priests taught that disease was a punishment from God for people's sins or the devil testing them. For example, during the Black Death in 1348, people believed God was angry at them, so flagellants whipped themselves in the street to beg God for mercy. People also went on pilgrimages and prayed to saints to cure them because they believed God sent the disease.<br><br>However, people also believed in miasma. Miasma was bad air that came from rotting filth, stagnant water, and dead bodies. People thought that if you breathed in the bad smell, it made you sick. During epidemics, people carried posies of flowers or lit fires to clear the air. Also, they believed in astrology, thinking that when planets lined up in unusual ways, it corrupted the air.<br><br>In conclusion, I agree that religion was the main cause because the Church controlled everything and told people what to believe."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Commentary:</strong> Identifies Church influence and miasma, but lacks rational humoural theory (Galen is omitted). Evaluative judgement is a simple assertion without criteria.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 4 Model (16/16 + 4 SPaG — Grade 9 Exemplary)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (20/20)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.65;">
      To a significant extent, ideas about the etiology of disease in medieval England (c1250–c1500) were fundamentally anchored in Christian religion, which provided the overarching intellectual framework explaining <em>why</em> illness occurred. In a deeply pious society where the Catholic Church held absolute ideological hegemony, illness was interpreted as a manifestation of divine will. Priests taught that epidemics and individual sicknesses were sent directly by God as a righteous punishment for human sin, a means of cleansing the soul through purgative suffering, or a test of faith, as reflected in biblical attitudes towards leprosy. Consequently, during the catastrophic 1348 Black Death, both ordinary peasants and civic authorities prioritized religious causes above all else: communities organized public processions of repentance, King Edward III commanded the Archbishop of Canterbury to lead penitential prayers, and groups of flagellants whipped themselves publicly to placate God's wrath. Because the Church held an absolute monopoly over book production in monastic scriptoria and governed medical faculties at Oxford and Cambridge, questioning theological causality was condemned as heresy. When Franciscan friar Roger Bacon suggested that medical knowledge should be derived from original scientific observation rather than sacred texts in 1277, Church authorities imprisoned him, reinforcing the doctrine that disease was ultimately governed by God.<br><br>
      However, medieval medical theory also accommodated influential environmental explanations, most notably the widespread belief in <strong>miasma</strong> (corrupted air) and celestial astrology. Drawing on classical Arabic and Greek traditions preserved in translation, medieval scholars argued that foul vapors rising from stagnant marshes, decomposing animal corpses, unburied cesspools, and latrines poisoned the surrounding atmosphere. When inhaled, this corrupted air was believed to disrupt the internal balance of the human body and produce pestilence. During the 1348 Black Death, physicians at the University of Paris officially declared that the plague was caused by an astrological conjunction of Saturn, Jupiter, and Mars in the sign of Aquarius in 1345, which supposedly generated poisonous subterranean vapors. Local town councils actively acted upon this miasmatic etiology: in 1349 and 1371, King Edward III and the Corporation of London ordered city butchers to cease slaughtering livestock within city walls and commanded rakers to clear dung and rotting offal from the streets to prevent bad air from infecting citizens. This proves that medieval people recognized tangible, physical catalysts for disease alongside divine retribution.<br><br>
      Crucially, at the level of individual clinical diagnosis, ideas about disease causation were dominated not by religion, but by the rational, biological framework of Hippocrates and Galen's <strong>Theory of the Four Humours</strong>. Medieval university-trained physicians explained illness as an internal physiological imbalance of blood, phlegm, black bile, and yellow bile. Sickness occurred when a humour was excessive or deficient due to seasonal weather, improper diet, lack of exercise, or emotional state—for instance, an excess of hot, dry yellow bile causing a burning fever. Physicians consulted zodiac charts and tested urine color, smell, and density against urine charts to diagnose which humor was disordered, prescribing clinical remedies such as phlebotomy (bloodletting with fleams or leeches) and herbal purges to restore humoural equilibrium. Remarkably, the Catholic Church actively endorsed and canonized Galen’s humoural system precisely because Galen was a monotheist who argued that the human anatomy was created with intelligent purpose by a single Creator. Far from seeing humoural theory as conflicting with faith, the medieval Church integrated it into Christian theology: God was the primary divine cause who permitted disease, while humoural imbalance was the secondary, natural mechanism through which illness physically manifested.<br><br>
      In conclusion, while environmental miasma and physiological humoural imbalance served as the day-to-day diagnostic models used by practicing physicians, ideas about the ultimate cause of disease were predominantly and decisively based on religion. In the medieval mindset, natural mechanisms were never autonomous; the Four Humours, planetary conjunctions, and poisonous air operated entirely under the sovereign will of God. Therefore, because religion dictated both the philosophical limits of university scholarship and the ultimate spiritual explanation for human suffering, medieval ideas of disease causation remained fundamentally theological.
    </div>
    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this secures Level 4 (Full Marks):</strong> Seamlessly addresses THREE distinct aspects (Church/divine punishment, miasma/astrology, Four Humours/Galenic physiology). Establishes a sophisticated analytical judgement (God as primary cause; humours as secondary mechanism). Exceptional SPaG.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    }
  ],

  // Lesson 4.1: Science & Technology in Modern Medicine
  lesson_4_1: [
    {
      id: "med26_q6_science_tech",
      mockId: "med_june_2026_live",
      qCode: "6",
      mockTitle: "Official Edexcel GCSE June 2026 Live Exam Paper (1HI0/11)",
      paperCode: "Paper 1 (1HI0/11)",
      type: "16-Mark Judgement Essay",
      marks: 16,
      targetMins: 25,
      questionText: "'Improvements in science and technology is the main reason why there has been progress in medicine in the modern period (c1900–present).' How far do you agree? Explain your answer. You may use the following in your answer: high-tech surgery; the NHS. You must also use information of your own. [16 marks + 4 SPaG = 20 marks]",
      stimulus: [
        "high-tech surgery",
        "the NHS"
      ],
      sourceExtract: "",
      modelAnswer: `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Standardisation Rules (Q5/Q6 Judgement Essays)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1. Three Aspects Required for Level 4:</strong> Must deploy at least three aspects (e.g. high-tech surgery/diagnostics, scientific pharmacology/DNA genetics, and state NHS infrastructure).<br><strong>2. Interdependence Judgement:</strong> Explains how technological breakthroughs were dependent upon state funding and democratic healthcare delivery to achieve real progress.</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 2 Model (6/16 Marks — Grade 5 Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">6/16 + 3 SPaG = 9/20</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "I agree that science and technology has been very important for progress in modern medicine. In the modern period, hospitals have advanced high-tech surgery. For example, doctors now use keyhole surgery with tiny cameras and fiber-optic cables, which means they do not have to make large incisions. Patients heal much faster and lose less blood. Also, hospitals use dialysis machines to clean the blood of patients with kidney failure, and surgeons can perform heart and organ transplants like Christian Barnard in 1967. Diagnostic technology like CT scans and MRI machines also allows doctors to see inside the body without operating.<br><br>However, the government was also important because of the NHS. In 1948, Aneurin Bevan set up the National Health Service so that everyone could get medical treatment for free at the point of delivery. Before 1948, poor people could not afford doctors. The NHS meant that all the new scientific advances could actually be given to ordinary people, not just the rich.<br><br>In conclusion, I think science and technology was the main reason because without scientific discoveries, the NHS would have nothing to treat patients with."
    </div>
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #fcd34d; font-size: 0.8rem; color: #78350f;">
      <strong>Examiner Commentary:</strong> Narrative description covering high-tech surgery and the NHS. Omits the third crucial aspect (pharmaceutical antibiotics and DNA genetics) and provides a simple asserting conclusion.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px 18px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Level 4 Model (16/16 + 4 SPaG — Grade 9 Exemplary)</span>
      <span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (20/20)</span>
    </div>
    <div style="font-size: 0.92rem; color: #0f172a; line-height: 1.65;">
      Improvements in science and technology have undoubtedly served as a primary engine of medical progress in the modern period (c1900–present), revolutionizing both the precision of internal diagnostics and the survivability of invasive clinical treatment. The twentieth century witnessed an unprecedented leap from exploratory surgery to non-invasive visualization and micro-precision intervention. Following Röntgen’s discovery of X-rays in 1895, the mid-twentieth century developed advanced diagnostic imaging: Godfrey Hounsfield’s invention of Computerised Tomography (CT scans) in 1972 and the subsequent rollout of Magnetic Resonance Imaging (MRI) in the 1980s enabled clinicians to detect microscopic malignant tumors and cerebral hemorrhages in three dimensions without exploratory incisions. In surgical wards, technological innovation replaced traumatic open surgery with laparoscopic 'keyhole surgery' using fiber-optic endoscopes and robotic surgical systems (such as the da Vinci robotic console), drastically reducing tissue trauma, blood loss, and hospital recovery times. Concurrently, high-tech life support equipment—including Willem Kolff’s artificial dialysis kidney machine (1943), heart-lung bypass machines, and microsurgical techniques enabling Christiaan Barnard’s first human heart transplant in 1967—allowed doctors to treat previously fatal organ failures. In surgical and diagnostic terms, technological capability has fundamentally redefined the limits of human longevity.<br><br>
      Furthermore, scientific breakthroughs in biochemistry, bacteriology, and molecular genetics provided the therapeutic weapons necessary to cure systemic infections and genetic conditions. In the early twentieth century, Paul Ehrlich developed Salvarsan 606 (1909), the first chemical 'magic bullet' to target specific syphilis microbes without poisoning the patient, followed by Gerhard Domagk’s discovery of the sulfonamide Prontosil in 1932. This chemical revolution culminated in Alexander Fleming’s 1928 discovery of penicillin and its subsequent purification and mass production by Howard Florey and Ernst Chain in 1941, which saved millions of lives from bacterial septicaemia during World War II and sparked the global antibiotic era. In the latter half of the century, pure scientific research unlocked the biological blueprint of human life: in 1953, James Watson, Francis Crick, Rosalind Franklin, and Maurice Wilkins mapped the double-helix structure of DNA. This scientific foundation culminated in the international Human Genome Project (1990–2003), which mapped all 20,000 human genes, unlocking gene therapy, synthetic monoclonal antibody therapies, and personalized genetic profiling to target hereditary conditions and cancer. Without these fundamental scientific breakthroughs, high-tech medical machines would have had no curative drugs or biological targets to administer.<br><br>
      However, it is vital to recognize that scientific and technological breakthroughs were entirely dependent upon <strong>state action, political ideology, and the creation of universal healthcare infrastructure</strong> to achieve actual progress across society. Prior to 1948, groundbreaking medical treatments were privatized commodities accessible only to the wealthy; millions of working-class Britons suffered untreated illnesses because they could not afford doctors' consultation fees or voluntary hospital subscriptions. Guided by William Beveridge’s 1942 Report targeting the 'Five Giants' (including Disease), Labour Minister of Health Aneurin Bevan spearheaded the creation of the National Health Service (NHS) on 5 July 1948. The NHS established a universal, nationalized healthcare system funded through progressive taxation, providing medical, surgical, and dental care completely free at the point of delivery from cradle to grave. It was the vast economic purchasing power and organizational logistics of the NHS that allowed high-tech diagnostic machines, intensive care units, and expensive pharmaceutical antibiotics to be systematically deployed across every hospital in the United Kingdom. Furthermore, government public health campaigns—such as compulsory vaccination schedules eradicating polio and diphtheria, the Clean Air Acts of 1956 following the Great Smog, and aggressive twenty-first-century anti-smoking legislation (the 2006 Health Act banning smoking in enclosed public spaces)—prevented far more mortality than individual high-tech surgical procedures could ever cure.<br><br>
      In conclusion, while improvements in science and technology provided the indispensable intellectual knowledge, pharmaceutical therapies, and surgical apparatus that made medical cures possible, they were not the sole reason for medical progress. Technological invention in isolation is sterile without political will and social distribution. Therefore, modern medical progress is best understood as a symbiotic partnership: science and technology generated the revolutionary clinical breakthroughs, but the creation of the NHS and proactive state public health policy ensured those breakthroughs became a universal human reality rather than a privileged luxury.
    </div>
    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #86efac; font-size: 0.82rem; color: #14532d;">
      <strong>Why this secures Level 4 (Full Marks):</strong> Masterfully deploys THREE distinct aspects (high-tech surgery/diagnostics, pharmacology/DNA genetics, and state NHS/public health infrastructure). Synthesizes a profound evaluative judgement on the symbiosis of science and social distribution.
    </div>
  </div>
</div>`,
      pdfUrl: "/pdfs/edexcel_medicine/edexcel_medicine_textbook_UNIFIED.pdf",
      mockUrl: "/units/edexcel_medicine/"
    }
  ]
};

// Now let's integrate these calibrated questions into mock_exam_bank_data.js under "edexcel_medicine"
// We'll write a script that updates the relevant lessons in mock_exam_bank_data.js

console.log('June 2026 calibrated questions prepared.');

module.exports = { med26Questions };

