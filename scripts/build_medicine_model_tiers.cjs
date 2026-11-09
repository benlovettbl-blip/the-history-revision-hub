/**
 * scripts/build_medicine_model_tiers.cjs
 *
 * Systematically builds out the 4-Tier Examiner Ladder (model_tiers)
 * for all 58 GCSE Exam Practice questions across all 26 lessons of Edexcel Medicine.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const medPath = path.join(rootDir, 'units', 'edexcel_medicine', 'data.js');
const pubMedPath = path.join(rootDir, 'public', 'units', 'edexcel_medicine', 'data.js');

let raw = fs.readFileSync(medPath, 'utf8');
const cleanRaw = raw
  .replace(/export\s+default\s+unitData;?/, '')
  .replace(/export\s+const\s+unitData\s*=/, 'module.exports =');

const sandbox = { module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
vm.runInContext(cleanRaw, sandbox);
const unitData = sandbox.module.exports;

console.log(`Processing ${unitData.lessons.length} lessons...`);

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function generateTiersForQuestion(q, lesson, qIdx) {
  const cleanExisting = cleanHtml(q.model || q.model_answer || '');
  const qText = q.question || '';
  const tariff = q.tariff || '';
  const type = q.type || '';

  // 1. WESTERN FRONT FEATURE DRILLS (4 marks: 2 x 2m)
  if (tariff.includes('4 marks') && (type.includes('feature_drills') || qText.toLowerCase().includes('describe two features') || qText.toLowerCase().includes('describe one feature'))) {
    // Split existing model into features if possible
    const paragraphs = cleanExisting.split(/<br\s*\/?>\s*<br\s*\/?>|\n\n/).filter(p => p.trim().length > 0);
    const feat1 = paragraphs[0] || cleanExisting;
    const feat2 = paragraphs[1] || '';

    return {
      tier_1m: {
        title: "1/4 Vague Features",
        score: "1 / 4 Marks",
        level: "Level 1 (Vague/No Detail)",
        text: "<p>One feature was that soldiers suffered injuries and illness in the trenches, and medical officers tried to treat them with medicine.</p>",
        verdict: "AO1 (1 mark). States a broad, generalized statement with zero clinical, operational, or tactical historical detail. Cannot award the second mark for either feature."
      },
      tier_2m: {
        title: "2/4 Partial Detail",
        score: "2 / 4 Marks",
        level: "Level 1 Top (One Feature Only)",
        text: feat2 ? `<p>${feat1}</p><p>Another feature was that medical teams tried to evacuate wounded men as fast as they could away from danger.</p>` : `<p>${feat1}</p>`,
        verdict: "AO1 (2 marks). Feature 1 identifies a valid feature with supporting factual detail (2/2 marks). The second feature is either missing or a vague assertion with no specific clinical or operational detail (0/2 marks)."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Full Marks (Feature + Detail)",
        badge: "Edexcel Benchmark",
        text: cleanExisting,
        verdict: "AO1 (4 marks). Full marks awarded. Two distinct historical features identified, each supported by precise factual evidence (clinical terminology, operational statistics, and historical names)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p><strong>Primary Tactical/Clinical Feature:</strong> Medical administration on the Western Front established standardized clinical protocols specifically engineered to counteract high-explosive shrapnel trauma and anaerobic soil contaminants.<br><strong>Operational Detail:</strong> Interventions such as the Carrel-Dakin buffered sodium hypochlorite continuous irrigation flush for gas gangrene and the forward deployment of the Thomas Splint (1915)—which stabilized compound fractures and reduced femur mortality from 80% to 20%—fundamentally transformed battlefield survival.<br><br><strong>Secondary Triage/Logistical Feature:</strong> The casualty evacuation chain functioned as a multi-echelon triage continuum linking Regimental Aid Posts, Advanced Dressing Stations, and Casualty Clearing Stations.<br><strong>Operational Detail:</strong> Staged medical logistics ensured life-saving surgical debridement and blood transfusions occurred within the critical physiological 'golden window' before rail evacuation to coastal Base Hospitals.</p>`,
        verdict: "Elite tactical and clinical analysis synthesizing ballistics, anaerobic pathophysiology, and operational evacuation triage."
      }
    };
  }

  // 2. WESTERN FRONT SOURCE UTILITY (8 marks)
  if (tariff.includes('8 marks') || type.includes('utility_of_sources')) {
    return {
      tier_2m: {
        title: "2/8 Simple Judgement",
        score: "2 / 8 Marks",
        level: "Level 1 (Simple Judgement)",
        text: "<p>The source is useful because it tells us that treating wounded soldiers was very difficult on the Western Front. It says that conditions were dangerous and soldiers suffered many casualties. However, it is not completely useful because it was written by one person who might be biased.</p>",
        verdict: "AO3 (2 marks). Paraphrases superficial source content. Comments on provenance are generic ('one person / might be biased') without applying qualitative contextual knowledge to evaluate usefulness."
      },
      tier_5m: {
        title: "5/8 Developed Content",
        score: "5 / 8 Marks",
        level: "Level 2 (No-Knowledge Trap)",
        text: `<p>The source is useful because it provides direct details about the severe operational conditions faced by medical personnel. The author describes the terrain and the difficulties of treating casualties under fire, which shows the physical danger involved.<br><br>Furthermore, the source is useful in its provenance because it was produced during the First World War by an eyewitness. However, it is limited because it only reflects one specific sector and cannot tell us about medical treatment across the entire Western Front.</p>`,
        verdict: "AO3 (5 marks). Level 2 maximum. Evaluates source content and makes sensible provenance observations, but falls into the mark scheme 'No-Knowledge Trap' by failing to deploy qualitative contextual knowledge to interrogate or corroborate the source's claims."
      },
      tier_8m: {
        title: "8/8 Grade 9 Exam ★",
        score: "8 / 8 Marks",
        level: "Level 3 Top (Content + Provenance + Context)",
        badge: "Edexcel Benchmark",
        text: cleanExisting,
        verdict: "AO3 (8 marks). Full marks awarded. Comprehensively evaluates both content and provenance using precise historical knowledge. Strictly obeys the independent evaluation and zero-comparison mark scheme criteria."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p>The evidentiary utility of the source lies in its capacity to illuminate the systemic collision between modern industrial firepower and frontline medical infrastructure. The document provides unmediated testimony on the physiological and tactical friction of evacuation across saturated, artillery-pulverized terrain.<br><br>When interrogating provenance, the historian must balance the source's operational authenticity against institutional constraints. While private testimony avoids the sanitized propaganda imperatives of the British War Office and civilian press censorship, it inherently captures localized tactical friction rather than administrative competence. Therefore, its evidentiary value is optimized when triangulated against RAMC War Diaries and DGAMS casualty returns to assess whether these conditions were anomalous or systemic.</p>`,
        verdict: "Elite historiographical evaluation analyzing tactical doctrine, ballistic cratering, and institutional censorship."
      }
    };
  }

  // 3. WESTERN FRONT FOLLOW-UP ENQUIRY (4 marks)
  if (tariff.includes('4 marks') && (type.includes('follow_up') || qText.toLowerCase().includes('follow up'))) {
    return {
      tier_2m: {
        title: "2/4 Generic Source Trap",
        score: "2 / 4 Marks",
        level: "Level 1 (Generic Source Trap)",
        text: `<p><strong>Detail in the source that I would follow up:</strong><br>The high number of casualties and the difficulty of treating them quickly.<br><br><strong>Question I would ask:</strong><br>How many soldiers were treated by the medical staff in total?<br><br><strong>What type of source I would use:</strong><br>RAMC records or ask a veteran soldier.<br><br><strong>How this might help answer my question:</strong><br>It would give me numbers about casualties.</p>`,
        verdict: "AO3 (2 marks). Selects a valid detail and asks a plausible question (2 marks). However, 'RAMC records' is a generic non-specific category and 'ask a veteran soldier' is historically invalid, scoring 0 marks under official mark scheme criteria."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Full Marks (Official Mark Scheme Benchmark)",
        badge: "Edexcel Benchmark",
        text: cleanExisting,
        verdict: "AO3 (4 marks). Full marks awarded. Precise detail quoted, question is tightly focused on evacuation/treatment logistics, source names a specific contemporary document (e.g. RAMC Field Ambulance War Diary or Battalion Medical Officer Casebook), and explanation directly demonstrates historical utility."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p><strong>Detail in Source that I would follow up:</strong><br>The logistical bottlenecks and severe transport delays encountered when evacuating wounded personnel under active artillery interdiction.<br><br><strong>Question I would ask:</strong><br>To what extent did the introduction of motorized field ambulances and light trench tramways reduce casualty transit times from Regimental Aid Posts to Casualty Clearing Stations during major offensives?<br><br><strong>Type of source I would look for:</strong><br>The official monthly War Diaries of the RAMC Director of Medical Services (Third Army) and the operational logs of the Motor Ambulance Convoys for the sector.<br><br><strong>How this might help answer my question:</strong><br>These administrative logs contain precise quantitative tables measuring average evacuation transit hours alongside commanding officers' confidential reports evaluating whether vehicular motor transport overcame the paralysis caused by shell cratering and mud.</p>`,
        verdict: "Exemplary primary archival research strategy linking operational documentation to medical historiography."
      }
    };
  }

  // 4. THEMATIC 12-MARK CAUSATION (12 marks)
  if (tariff.includes('12 marks') || type.includes('causal_explanation')) {
    const paragraphs = cleanExisting.split(/<br\s*\/?>\s*<br\s*\/?>|\n\n/).filter(p => p.trim().length > 0);
    const aspect1 = paragraphs[0] || cleanExisting;
    const aspect2 = paragraphs[1] || '';

    return {
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 Bottom (Story/Assertion)",
        text: "<p>There were several reasons why this happened in medicine. In the past, people did not understand science or hygiene. When new ideas came along, doctors began to make discoveries and write books, which helped people learn more about health and illness. Therefore, medical knowledge got better over time.</p>",
        verdict: "AO1/AO2 (3 marks). Generalized narrative description. Outlines broad historical changes but provides zero specific dates, named individuals, or explicit causal explanation linked to the question stem."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 (Descriptive Narrative)",
        text: aspect2 ? `<p>${aspect1}</p><p>${aspect2}</p><p>In conclusion, these developments were important because they changed how medicine was practiced in Britain.</p>` : `<p>${aspect1}</p>`,
        verdict: "AO1/AO2 (6 marks). Level 2 maximum. Describes relevant historical factors with some factual knowledge, but only addresses one or two aspects and remains narrative. Lacks sustained analytical PEEL links explaining *why* change occurred."
      },
      tier_12m: {
        title: "12/12 Grade 9 Exam ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: cleanExisting,
        verdict: "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content (including extensive own knowledge beyond the stimulus), structured in sustained, analytical PEEL paragraphs with precise historical vocabulary throughout."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p>Medical transformation was driven by the convergence of intellectual paradigm shifts, technological precision, and state-sanctioned institutional reform.<br><br>Firstly, empirical epistemology dismantled classical dogmatism: medical innovators rejected Galenic authority in favor of direct anatomical dissection, controlled laboratory experimentation, and statistical clinical observation, fundamentally redefining disease etiology.<br><br>Secondly, technological and chemical innovation provided the physical apparatus necessary to translate theory into curative intervention: advances in microscopy, chemical antiseptics, and standardized synthetic pharmaceuticals eliminated historical barriers of infection and diagnostic blindness.<br><br>Thirdly, these clinical breakthroughs achieved societal impact only when mobilized through centralized legislative mandates, municipal sanitary infrastructure, and universal healthcare funding, which democratized access to life-saving clinical progress across the British population.</p>`,
        verdict: "Masterclass causal synthesis weighing epistemological revolution, technological apparatus, and socio-political distribution."
      }
    };
  }

  // 5. THEMATIC 16-MARK (+4 SPaG) JUDGEMENT ESSAYS (16+4 marks)
  if (tariff.includes('16') || type.includes('judgement_essay') || qText.toLowerCase().includes('how far do you agree')) {
    const paragraphs = cleanExisting.split(/<br\s*\/?>\s*<br\s*\/?>|\n\n/).filter(p => p.trim().length > 0);
    const side1 = paragraphs[0] || cleanExisting;
    const side2 = paragraphs[1] || '';

    return {
      tier_4m: {
        title: "4/16 Simple Statement",
        score: "4 / 16 Marks",
        level: "Level 1 (Simple Statement)",
        text: "<p>I agree with this statement because medical ideas were very traditional during this time. People believed what they were told by authorities and did not question things. Although some other factors were important, the main reason was traditional belief because it lasted for hundreds of years. Therefore I agree with the statement.</p>",
        verdict: "AO1/AO2 (4 marks) + 1 SPaG = 5/20. Simple one-sided assertion with minimal supporting historical knowledge. Completely lacks counter-argument or evaluative criteria."
      },
      tier_8m: {
        title: "8/16 Descriptive Account",
        score: "8 / 16 Marks",
        level: "Level 2 (Descriptive Account)",
        text: side2 ? `<p>${side1}</p><p>${side2}</p><p>In conclusion, I agree with the statement to some extent, but other factors were also important.</p>` : `<p>${side1}</p>`,
        verdict: "AO1/AO2 (8 marks) + 2 SPaG = 10/20. Narrative account describing both sides of the debate. Lacks sustained evaluation or detailed evidence across 3 distinct aspects; conclusion is a simple re-statement."
      },
      tier_16m: {
        title: "16/16 Grade 9 Exam ★",
        score: "16 / 16 Marks (+4 SPaG)",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: cleanExisting,
        verdict: "AO1/AO2 (16 marks) + AO4 (4 marks SPaG) = 20/20. Full marks awarded. Demonstrates sustained, balanced analysis across three distinct aspects, weighing competing historical factors with criteria-driven analytical judgement."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10 (16+4)",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p>Historical analysis demonstrates that medical progress cannot be attributed to a monocausal catalyst, but rather represents a dialectical interaction between scientific breakthrough, professional infrastructure, and socio-economic distribution.<br><br>While individual genius and scientific innovation generated the indispensable conceptual breakthroughs that overturned ancient orthodoxy, these discoveries remained sterile without institutional validation, peer reproduction, and public dissemination.<br><br>Crucially, the ultimate determinant of medical transformation was the intervention of the centralized state: only legislative enforcement, universal healthcare infrastructure, and compulsory municipal sanitation could translate clinical theory into sustained, population-wide mortality reduction.</p>`,
        verdict: "Elite historiographical synthesis weighing dialectical paradigms of scientific discovery, institutional inertia, and state authority."
      }
    };
  }

  // 6. DEFAULT: THEMATIC 4-MARK COMPARISON (Similarity / Difference)
  // Let's create tailored Level 1 assertion and Level 2 partial trap based on cleanExisting
  const sentences = cleanExisting.split(/\.\s+/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0] || "One way they were compared was in their understanding of disease.";

  return {
    tier_1m: {
      title: "1/4 Assertion",
      score: "1 / 4 Marks",
      level: "Level 1 Bottom (Assertion)",
      text: `<p>${firstSentence.replace(/that\s+he\s+focused\s+on\s+<strong>.*?<\/strong>,?\s*/i, 'that they had different ideas ')}.</p>`,
      verdict: "AO2 (1 mark). Simple assertion identifying a general comparative theme without specific historical detail, clinical terminology, or named evidence from either period."
    },
    tier_2m: {
      title: "2/4 Partial Trap",
      score: "2 / 4 Marks",
      level: "Level 1 Top (Supported Statement)",
      text: `<p>${sentences.slice(0, 3).join('. ')}. However, in the other period, medical practitioners did things differently.</p>`,
      verdict: "AO2 (2 marks). Identifies a valid comparison and provides historical detail for one period, but provides zero specific factual detail or named evidence for the comparison period, creating an unbalanced answer."
    },
    tier_4m: {
      title: "4/4 Grade 9 Exam ★",
      score: "4 / 4 Marks",
      level: "Level 2 Top (Pearson Exam Standard)",
      badge: "Edexcel Benchmark",
      text: cleanExisting,
      verdict: "AO2 (4 marks). Full marks awarded. Comparative criterion explicitly stated, supported by precise named historical evidence from BOTH periods, and concluded with a direct analytical comparison."
    },
    tier_10m: {
      title: "Level 10 Scholar 🚀",
      score: "Level 10",
      level: "Academic Distinction (Scholar)",
      badge: "A* Masterclass",
      text: `<p>The comparative paradigm reflects an epistemological transformation from classical deductive authority to empirical clinical nosology.<br><br>In the earlier era, diagnosis and therapy were governed by scholastic adherence to Galenic humoral pathology and environmental miasma, treating illness as an internal systemic imbalance deduced from uroscopy and astrological conjunctions. Conversely, subsequent medical developments replaced theoretical dogmatism with empirical bedside observation, pathological anatomy, and bacteriological vector identification, fundamentally redefining disease from an individual imbalance to an externally caused, identifiable biological entity.</p>`,
      verdict: "Elite historiographical comparison analyzing ontological shifts from classical humoral deduction to empirical clinical pathology."
    }
  };
}

let modifiedCount = 0;
unitData.lessons.forEach((lesson, lIdx) => {
  if (lesson.exam_practice && lesson.exam_practice.questions) {
    lesson.exam_practice.questions.forEach((q, qIdx) => {
      q.model_tiers = generateTiersForQuestion(q, lesson, qIdx);
      if (q.model) {
        q.model = cleanHtml(q.model);
      }
      modifiedCount++;
    });
  }
});

console.log(`Generated model_tiers for ${modifiedCount} questions across 26 lessons!`);

// Format unitData back to file
const newFileContent = `export const unitData = ${JSON.stringify(unitData, null, 2)};\n\nexport default unitData;\n`;

fs.writeFileSync(medPath, newFileContent, 'utf8');
console.log(`✅ Saved updated: ${medPath}`);

fs.writeFileSync(pubMedPath, newFileContent, 'utf8');
console.log(`✅ Saved updated: ${pubMedPath}`);
