/**
 * scripts/update_viewer_inference.cjs
 * Upgrades public/interactive_mats/viewer.html and dist/interactive_mats/viewer.html
 * with full exam-practice question type scaffolding (Inference, Features, Comparison,
 * Utility, Narrative, Causal 12m, Evaluative Essay 16m), eliminating inappropriate
 * causal/essay boilerplate from 4-mark Source Inference questions.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const replacementCode = `    let currentWritingStudioTaskIndex = 0;
    let currentWritingStudioTasks = [];
    const userDraftsByTask = {};

    function getTaskStudioLabel(t, idx, isKs2) {
      if (isKs2) {
        const isBigQ = idx === 3 || (t.tag && t.tag.toLowerCase().includes('challenge')) || (t.type && t.type.toLowerCase().includes('big'));
        const defaultLabel = isBigQ ? '★ 4. The Big Question' : \`Task \${idx + 1}\`;
        return t.tag ? \`\${idx + 1}. \${t.tag}\` : defaultLabel;
      }
      if (t.tag) return \`\${idx + 1}. \${t.tag}\`;
      
      const text = ((t.question || t.prompt || '') + ' ' + (t.type || '') + ' ' + (t.tariff || '')).toLowerCase();
      const qNum = \`Q\${idx + 1}\`;

      if (text.includes('infer')) return \`\${qNum}: Source Inference (4m)\`;
      if (text.includes('two features') || text.includes('feature_drills') || text.includes('two_features')) return \`\${qNum}: Two Features (4m)\`;
      if (text.includes('similar') || text.includes('difference') || text.includes('similarity_difference')) return \`\${qNum}: Comparison (4m)\`;
      if (text.includes('consequence')) return \`\${qNum}: Consequence (4m)\`;
      if (text.includes('useful') || text.includes('utility')) return \`\${qNum}: Source Utility (8m)\`;
      if (text.includes('narrative')) return \`\${qNum}: Narrative Account (8m)\`;
      if (text.includes('importance')) return \`\${qNum}: Explain Importance (8m)\`;
      if (text.includes('16 marks') || text.includes('16+4') || text.includes('judgement') || text.includes('verdict')) return \`\${qNum}: Evaluative Essay (16m)\`;
      if (text.includes('12 marks') || text.includes('causation') || text.includes('explain why')) return \`\${qNum}: Causal Explanation (12m)\`;
      
      if (t.tariff) return \`\${qNum}: \${t.tariff}\`;
      return \`Task \${idx + 1}\`;
    }

    function getTaskTypeInfo(task, unit, lesson, workbookPage = 3) {
      const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
      const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.year_group || unit.yearGroup || '').toLowerCase().includes('year') || (unit.keyStage || '').toLowerCase().includes('ks3'));
      if (isKs2) return { type: 'ks2' };

      const qText = ((task.question || task.prompt || '') + ' ' + (task.tariff || '') + ' ' + (task.type || '')).toLowerCase();

      // 1. Source Inference (4 marks) - e.g. Edexcel GCSE Paper 3 Section A Q1
      if (qText.includes('infer') || task.type === '4-mark-inference' || (task.marks === 4 && qText.includes('source'))) {
        const srcMatch = (task.question || '').match(/Source\s+([A-Z])/i);
        const src = srcMatch ? \`Source \${srcMatch[1].toUpperCase()}\` : 'Source A';
        return {
          type: 'inference_4m',
          tariffDesc: task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Paper 3 Section A\` : 'Edexcel GCSE Paper 3 Section A &bull; Q1: Source Inference [4 marks]',
          starter: \`One thing I can infer from \${src} is that...\`,
          starterHelper: \`Follow with: "Details in the source that tell me this are: '...'"\`,
          bronzeInstruction: \`State your first clear deduction, then quote the exact supporting words from \${src}.\`,
          defaultChecklist: [
            { letter: 'I1', name: 'First Inference', desc: \`State what you can deduce from \${src} about the enquiry topic.\` },
            { letter: 'Q1', name: 'Supporting Detail', desc: \`Quote the exact words from \${src} that support your first inference.\` },
            { letter: 'I2', name: 'Second Inference', desc: \`State a second, different deduction from \${src}.\` },
            { letter: 'Q2', name: 'Supporting Detail', desc: \`Quote a second distinct detail or quote from \${src} that supports inference 2.\` }
          ],
          goldPrompt: task.examiner_tip || "Beware the 'Dealt vs. Felt' trap: do not simply write about emotions. Focus on what was actively happening. State two distinct inferences backed by different source details.",
          goldInstruction: "Examiner Guidance: State TWO distinct deductions. Each deduction MUST be supported by a direct quote or specific detail from the source.",
          placeholder: \`(i) What I can infer:\\nOne thing I can infer from \${src} is that...\\nDetails in the source that tell me this:\\n\\"...\\"\\n\\n(ii) What I can infer:\\nA second thing I can infer from \${src} is that...\\nDetails in the source that tell me this:\\n\\"...\\"\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Two-Part Deduction & Evidence)',
          trackerTerms: ['First Inference', 'Source Quote 1', 'Second Inference', 'Source Quote 2']
        };
      }

      // 2. Describe / Explain Two Features (4 marks)
      if (qText.includes('two features') || qText.includes('feature_drills') || qText.includes('two_features') || (task.marks === 4 && qText.includes('feature'))) {
        return {
          type: 'features_4m',
          tariffDesc: 'Edexcel GCSE &bull; 4-Mark Feature Drill [4 marks]',
          starter: \`One key feature of this period was...\`,
          bronzeInstruction: 'Identify your first feature clearly, then support it with precise historical knowledge.',
          defaultChecklist: [
            { letter: 'F1', name: 'Feature 1 Identification', desc: 'Identify and describe the first distinct feature.' },
            { letter: 'D1', name: 'Supporting Evidence', desc: 'Add specific contextual knowledge (dates, names, statistics).' },
            { letter: 'F2', name: 'Feature 2 Identification', desc: 'Identify and describe a second, distinct feature.' },
            { letter: 'D2', name: 'Supporting Evidence', desc: 'Add precise supporting factual evidence for the second feature.' }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: Keep each feature clearly separate. Award 1 mark for identifying the feature, and 1 mark for specific supporting factual detail.",
          goldInstruction: "Ensure both features are completely distinct and supported by precise historical facts.",
          placeholder: \`Feature 1: One key feature was...\\nSupporting detail: Specifically, this meant that...\\n\\nFeature 2: A second key feature was...\\nSupporting detail: For example...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Two Distinct Features)',
          trackerTerms: ['Feature 1', 'Supporting Detail 1', 'Feature 2', 'Supporting Detail 2']
        };
      }

      // 3. Similarity / Difference Comparison (4 marks)
      if (qText.includes('similar') || qText.includes('difference') || qText.includes('similarity_difference') || (task.marks === 4 && qText.includes('way in which'))) {
        return {
          type: 'comparison_4m',
          tariffDesc: 'Edexcel GCSE Paper 1 &bull; Q1: Similarity / Difference [4 marks]',
          starter: \`One way in which these two periods were similar/different was...\`,
          bronzeInstruction: 'State the clear comparative criterion, then provide evidence from both periods.',
          defaultChecklist: [
            { letter: 'P', name: 'Point', desc: 'State the clear comparative criterion (similarity or difference).' },
            { letter: 'E1', name: 'Evidence (Period 1)', desc: 'Provide specific, named historical detail from the first period.' },
            { letter: 'E2', name: 'Evidence (Period 2)', desc: 'Provide specific, named historical detail from the second period.' },
            { letter: 'C', name: 'Comparison Link', desc: 'Conclude with an explicit sentence showing how both periods connect.' }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: Do not write two separate paragraphs about each period. Ensure both periods are directly compared across a single conceptual thread.",
          goldInstruction: "Ensure you include precise factual evidence from BOTH historical periods.",
          placeholder: \`One way in which [Topic A] and [Topic B] were similar/different was that...\\nIn the first period, ...\\nSimilarly / in contrast, in the second period, ...\\nTherefore, both periods...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Comparative PEEC Structure)',
          trackerTerms: ['Comparative Point', 'Period 1 Detail', 'Period 2 Detail', 'Comparison Link']
        };
      }

      // 4. Consequence (4 marks)
      if (qText.includes('consequence') || task.type === 'consequence_4m') {
        return {
          type: 'consequence_4m',
          tariffDesc: 'Edexcel GCSE Paper 2 &bull; Explain One Consequence [4 marks]',
          starter: \`One consequence of this development was that...\`,
          bronzeInstruction: 'State the consequence clearly, then explain what this directly led to.',
          defaultChecklist: [
            { letter: 'P', name: 'Point', desc: 'State one clear consequence.' },
            { letter: 'E', name: 'Evidence', desc: 'Support with precise, accurate historical facts.' },
            { letter: 'X', name: 'Explanation', desc: 'Explain what this directly caused or resulted in.' }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: Focus on the RESULT or OUTCOME of the event, not the background causes that preceded it.",
          goldInstruction: "Use clear consequence connectives like 'Consequently', 'As a direct result', and 'This led to...'",
          placeholder: \`One consequence was that...\\nSpecifically, this occurred when...\\nConsequently, this directly led to...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Consequence & Outcome)',
          trackerTerms: ['Consequence', 'Factual Evidence', 'Explanation of Impact']
        };
      }

      // 5. Source Utility (8 marks)
      if (qText.includes('useful') || qText.includes('utility') || (task.marks === 8 && qText.includes('source'))) {
        return {
          type: 'utility_8m',
          tariffDesc: 'Edexcel GCSE Paper 1/3 &bull; Q3: Source Utility [8 marks]',
          starter: \`Source A is useful to an historian studying this topic because...\`,
          bronzeInstruction: 'Evaluate the usefulness of content and provenance (Nature, Origin, Purpose) using contextual knowledge.',
          defaultChecklist: [
            { letter: 'C', name: 'Content & Knowledge', desc: 'Analyse what the source says/shows and corroborate with own knowledge.' },
            { letter: 'P', name: 'Provenance & Purpose', desc: 'Evaluate who made it, when, why, and how this affects its usefulness.' },
            { letter: 'L', name: 'Limitations', desc: 'Identify any gaps or biases in the source content.' },
            { letter: 'J', name: 'Overall Judgement', desc: 'Reach a substantiated judgement on utility for this specific enquiry.' }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: Never dismiss a source as 'biased and therefore useless'. Even propaganda is intensely useful for revealing contemporary attitudes and intentions.",
          goldInstruction: "Evaluate both Content AND Provenance (NOP) anchored in precise contextual knowledge.",
          placeholder: \`Source A is useful for an enquiry into [topic] because it reveals that...\\nFrom my own knowledge, I know that...\\nThe provenance of Source A adds to its usefulness because it was written by...\\nHowever, the source is limited because...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Content & Provenance Evaluation)',
          trackerTerms: ['Content Usefulness', 'Contextual Knowledge', 'Provenance (NOP)', 'Enquiry Judgement']
        };
      }

      // 6. Narrative Account (8 marks)
      if (qText.includes('narrative') || task.type === 'narrative_8' || task.type === 'narrative_account') {
        return {
          type: 'narrative_8m',
          tariffDesc: 'Edexcel GCSE Paper 2 &bull; Question 2: Narrative Account [8 marks]',
          starter: \`The sequence of events began when...\`,
          bronzeInstruction: 'Construct a chronological, causal narrative linking beginning, development, and outcome.',
          defaultChecklist: [
            { letter: 'B', name: 'Beginning / Catalyst', desc: 'Explain the initial catalyst that triggered the sequence.' },
            { letter: 'D', name: 'Development / Turning Point', desc: 'Show how one event directly caused the next step.' },
            { letter: 'O', name: 'Outcome / Culmination', desc: 'Explain the final resolution or lasting consequence.' }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: This is not just a chronological list. You must show CAUSAL LINKS (how event A led to event B, which caused event C).",
          goldInstruction: "Use sequencing and causal connectives: 'Initially', 'This prompted', 'Following this', 'Ultimately resulting in...'",
          placeholder: \`The sequence of events began with...\\nThis directly led to...\\nAs a result of this development, ...\\nFinally, this culminated in...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Causal Narrative Flow)',
          trackerTerms: ['Catalyst Event', 'Causal Link 1', 'Causal Link 2', 'Outcome']
        };
      }

      // 7. Causal Explanation (12 marks)
      if (qText.includes('explain why') || qText.includes('12 marks') || task.marks === 12 || task.type === 'causation_12m' || task.type === '12-mark') {
        let checklist = [
          { letter: 'P1', name: 'Point 1 (First Factor)', desc: 'State and explain your first major causal factor.' },
          { letter: 'P2', name: 'Point 2 (Second Factor)', desc: 'State and explain a second distinct causal factor.' },
          { letter: 'P3', name: 'Point 3 (Own Knowledge)', desc: 'Introduce and analyze an additional factor from beyond the stimulus.' },
          { letter: 'L', name: 'Causal Links', desc: 'Link all factors together to show why they resulted in the outcome.' }
        ];
        let tracker = ['Causal Factor 1', 'Causal Factor 2', 'Causal Factor 3'];
        if (Array.isArray(task.stimulus) && task.stimulus.length >= 2) {
          checklist = [
            { letter: 'S1', name: 'Stimulus Factor 1', desc: \`Explain the causal impact of: \${task.stimulus[0]}.\` },
            { letter: 'S2', name: 'Stimulus Factor 2', desc: \`Explain the causal impact of: \${task.stimulus[1]}.\` },
            { letter: 'OK', name: 'Own Knowledge Factor', desc: 'Introduce a third crucial factor from beyond the stimulus prompts.' },
            { letter: 'X', name: 'Sustained Analysis', desc: 'Explain the relative importance and interaction between factors.' }
          ];
          tracker = [task.stimulus[0].slice(0, 24), task.stimulus[1].slice(0, 24), 'Own Knowledge'];
        }
        return {
          type: 'causal_12m',
          tariffDesc: task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Causal Explanation\` : 'Edexcel GCSE &bull; 12-Mark Causal Explanation',
          starter: \`A decisive factor explaining \${lesson.title || 'this development'} was...\`,
          bronzeInstruction: 'Complete this sentence by stating your primary causal factor.',
          defaultChecklist: checklist,
          goldPrompt: task.examiner_tip || "Examiner Tip: To reach Level 4, you must go beyond describing events. Explain HOW and WHY the factors worked together to produce the historical outcome.",
          goldInstruction: "Use high-level connectives like Consequently, Crucially, and This proved decisive because...",
          placeholder: \`Draft your analytical explanation here deploying your causal connectives and evidence...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • 3-Factor Causal Analysis)',
          trackerTerms: tracker
        };
      }

      // 8. Evaluative Essay (16 marks)
      if (qText.includes('how far do you agree') || qText.includes('16 marks') || task.marks === 16 || task.type === 'judgement_16m') {
        return {
          type: 'essay_16m',
          tariffDesc: 'Edexcel GCSE &bull; 16-Mark Evaluative Essay (+4 SPaG)',
          starter: \`It can be argued that [named factor] was decisive because... However, an alternative view is that...\`,
          bronzeInstruction: 'Establish your criteria-led line of argument and introduce both sides of the debate.',
          defaultChecklist: [
            { letter: 'T', name: 'Thesis / Introduction', desc: 'Define your criteria and state your initial overall judgement.' },
            { letter: 'A', name: 'Arguments For Statement', desc: 'Analyse the named factor with precise historical evidence.' },
            { letter: 'C', name: 'Counter-Arguments', desc: 'Analyse 1–2 alternative factors with detailed evidence.' },
            { letter: 'J', name: 'Sustained Judgement', desc: 'Reach a nuanced conclusion weighing which factor was most decisive.' }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: A Level 4 judgement is criteria-led: establish why one factor outweighs another (e.g., long-term precondition vs short-term catalyst).",
          goldInstruction: "Structure a balanced, criteria-led argument using evaluative language ('fundamentally', 'predominantly', 'outweighed by').",
          placeholder: \`Introduction & Thesis: State your line of argument...\\n\\nSection 1 (Named Factor): Explain the evidence supporting the prompt...\\n\\nSection 2 (Alternative Factors): Evaluate other significant causes...\\n\\nConclusion: Provide your substantiated final judgement...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Evaluative Essay)',
          trackerTerms: ['Thesis Statement', 'Named Factor', 'Alternative Factor', 'Final Judgement']
        };
      }

      // Fallback general secondary
      return {
        type: 'general_secondary',
        tariffDesc: task.tariff || (isKs3 ? \`Pupil Workbook Page \${workbookPage} &bull; Key Stage 3 Disciplinary Write-Up\` : '12-Mark Disciplinary Analysis'),
        starter: \`A decisive factor explaining \${lesson.title || 'this development'} was...\`,
        bronzeInstruction: 'Complete this sentence by stating your primary causal factor.',
        defaultChecklist: [
          { letter: 'P', name: 'Point', desc: 'State your main historical claim clearly.' },
          { letter: 'E', name: 'Evidence', desc: 'Support with precise historical facts.' },
          { letter: 'X', name: 'Explanation', desc: 'Explain how this evidence substantiates your claim.' }
        ],
        goldPrompt: task.examiner_tip || "Deploy precise historical vocabulary to substantiate your criteria-led judgement.",
        goldInstruction: "Use high-level connectives like Consequently, Crucially, and This proved decisive because...",
        placeholder: \`Draft your analytical paragraph here deploying your causal connectives and evidence...\`,
        spacingBadge: '(Secondary 7.5mm Ruled Lines)',
        trackerTerms: ['Historical Claim', 'Factual Evidence', 'Explanation']
      };
    }

    function renderWritingStudio(unit, lesson) {
      const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
      const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.year_group || unit.yearGroup || '').toLowerCase().includes('year') || (unit.keyStage || '').toLowerCase().includes('ks3'));

      // Determine full task list
      if (isKs2) {
        if (Array.isArray(lesson.tasks) && lesson.tasks.length > 0) {
          currentWritingStudioTasks = lesson.tasks;
        } else if (Array.isArray(lesson.writing_tasks) && lesson.writing_tasks.length > 0) {
          currentWritingStudioTasks = lesson.writing_tasks;
        } else {
          currentWritingStudioTasks = [lesson.extended_writing || {}];
        }
      } else {
        if (lesson.exam_practice?.questions && Array.isArray(lesson.exam_practice.questions) && lesson.exam_practice.questions.length > 0) {
          currentWritingStudioTasks = lesson.exam_practice.questions;
        } else if (Array.isArray(lesson.tasks) && lesson.tasks.length > 0) {
          currentWritingStudioTasks = lesson.tasks;
        } else if (Array.isArray(lesson.writing_tasks) && lesson.writing_tasks.length > 0) {
          currentWritingStudioTasks = lesson.writing_tasks;
        } else if (lesson.extended_writing) {
          currentWritingStudioTasks = [lesson.extended_writing];
        } else {
          currentWritingStudioTasks = [{}];
        }
      }

      // Configure multi-task selector bar
      const selectorBar = document.getElementById('ks2-tasks-selector-bar');
      const btnGroup = document.getElementById('ks2-task-buttons-group');
      if (selectorBar && btnGroup) {
        if (currentWritingStudioTasks.length > 1) {
          selectorBar.style.display = 'flex';
          btnGroup.innerHTML = currentWritingStudioTasks.map((t, idx) => {
            const label = getTaskStudioLabel(t, idx, isKs2);
            return \`
              <button type="button" class="ks2-task-nav-btn" data-task-idx="\${idx}" style="padding: 5px 12px; font-size: 0.74rem; font-weight: 700; border-radius: 5px; cursor: pointer; transition: all 0.15s ease; border: 1.2px solid #334155; background: #1e293b; color: #cbd5e1; display: inline-flex; align-items: center; gap: 5px;">
                \${label}
              </button>
            \`;
          }).join('');

          btnGroup.querySelectorAll('.ks2-task-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const idx = parseInt(e.currentTarget.getAttribute('data-task-idx'), 10);
              switchWritingStudioTask(idx, unit, lesson, true);
            });
          });
        } else {
          selectorBar.style.display = 'none';
        }
      }

      // Render default task (retain index if valid)
      if (currentWritingStudioTaskIndex >= currentWritingStudioTasks.length) {
        currentWritingStudioTaskIndex = 0;
      }
      switchWritingStudioTask(currentWritingStudioTaskIndex, unit, lesson, false);

      // Connectives Palette
      if (isKs2) {
        const ks2Connectives = [
          { word: 'Because', tip: 'Explains the reason why an event happened.' },
          { word: 'As a result', tip: 'Shows what happened next because of an earlier event.' },
          { word: 'Therefore', tip: 'Proves your point using the historical facts.' },
          { word: 'Consequently', tip: 'Explains the direct result of a key decision.' },
          { word: 'Furthermore', tip: 'Adds another important piece of historical evidence.' },
          { word: 'However', tip: 'Shows another point of view or an obstacle.' }
        ];
        document.getElementById('palette-chips-connectives').innerHTML = ks2Connectives.map(c => \`
          <span class="palette-chip" onclick="showWordHelp('\${c.word}', '\${c.tip.replace(/'/g, "\\\\'")}')">\${c.word}</span>
        \`).join('');
      } else {
        const connectives = lesson.tasks?.[0]?.scaffolding?.connective_bank || ['Consequently', 'Catalyzed', 'Decisively', 'Undermined', 'Crucially', 'Inherently'];
        document.getElementById('palette-chips-connectives').innerHTML = connectives.slice(0, 6).map(c => \`
          <span class="palette-chip" onclick="showWordHelp('\${c}', 'Links historical cause to effect, proving consequence rather than mere chronology.')">\${c}</span>
        \`).join('');
      }

      // Concepts / Key Vocabulary Bank
      const vocabs = (lesson.vocab || lesson.vocabulary || []);
      document.getElementById('palette-chips-concepts').innerHTML = vocabs.slice(0, 10).map(v => {
        const term = typeof v === 'string' ? v : (v.term || v.name);
        const def = resolveConceptDefinition(v, lesson, stagesData);
        return \`<span class="palette-chip" onclick="showWordHelp('\${term.replace(/'/g, "\\\\'")}', '\${def.replace(/'/g, "\\\\'")}')">\${term}</span>\`;
      }).join('');

      // Adjectives
      if (isKs2) {
        const ks2Adjectives = [
          { term: 'Essential', def: 'Completely necessary; Britain could not have survived without it.' },
          { term: 'Courageous', def: 'Showing bravery in the face of danger.' },
          { term: 'Dangerous', def: 'Involving high risk of injury, explosion, or bombing.' },
          { term: 'Decisive', def: 'Causing a major turning point that changed the war.' },
          { term: 'Heroic', def: 'Acting with great courage and putting others first.' },
          { term: 'Vital', def: 'Crucial for life, safety, and victory.' }
        ];
        document.getElementById('palette-chips-adjectives').innerHTML = ks2Adjectives.map(a => \`
          <span class="palette-chip" onclick="showWordHelp('\${a.term}', '\${a.def.replace(/'/g, "\\\\'")}')">\${a.term}</span>
        \`).join('');
      } else {
        const adjectives = [
          { term: 'Decisive', def: 'Settling an issue convincingly or producing a definitive result.' },
          { term: 'Catastrophic', def: 'Involving or causing sudden, great damage or suffering.' },
          { term: 'Irrevocable', def: 'Not able to be changed, reversed, or recovered.' },
          { term: 'Formidable', def: 'Inspiring fear or respect through being impressively large or powerful.' }
        ];
        document.getElementById('palette-chips-adjectives').innerHTML = adjectives.map(a => \`
          <span class="palette-chip" onclick="showWordHelp('\${a.term}', '\${a.def}')">\${a.term}</span>
        \`).join('');
      }

      // Setup write-up pad listener
      setupWriteupPadListener();
    }

    function switchWritingStudioTask(taskIdx, unit, lesson, saveOldDraft = true) {
      const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
      const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.year_group || unit.yearGroup || '').toLowerCase().includes('year') || (unit.keyStage || '').toLowerCase().includes('ks3'));

      const textarea = document.getElementById('pupil-writeup-textarea');
      if (saveOldDraft && textarea) {
        userDraftsByTask[currentWritingStudioTaskIndex] = textarea.value;
      }
      currentWritingStudioTaskIndex = taskIdx;

      // Update button active visuals
      const btnGroup = document.getElementById('ks2-task-buttons-group');
      if (btnGroup) {
        const btns = btnGroup.querySelectorAll('.ks2-task-nav-btn');
        btns.forEach((b, i) => {
          const isBigQ = isKs2 && (i === 3 || (currentWritingStudioTasks[i]?.tag && currentWritingStudioTasks[i].tag.toLowerCase().includes('challenge')));
          if (i === taskIdx) {
            if (isBigQ) {
              b.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
              b.style.color = '#ffffff';
              b.style.borderColor = '#fcd34d';
              b.style.boxShadow = '0 0 10px rgba(217, 119, 6, 0.45)';
            } else {
              b.style.background = 'linear-gradient(135deg, #0284c7, #2563eb)';
              b.style.color = '#ffffff';
              b.style.borderColor = '#38bdf8';
              b.style.boxShadow = '0 0 10px rgba(2, 132, 199, 0.4)';
            }
          } else {
            if (isBigQ) {
              b.style.background = '#272115';
              b.style.color = '#fde68a';
              b.style.borderColor = '#78350f';
              b.style.boxShadow = 'none';
            } else {
              b.style.background = '#1e293b';
              b.style.color = '#cbd5e1';
              b.style.borderColor = '#334155';
              b.style.boxShadow = 'none';
            }
          }
        });
      }

      const task = currentWritingStudioTasks[taskIdx] || {};
      const scaffolding = task.scaffolding || {};

      const lessonIndex = Array.isArray(unit.lessons)
        ? unit.lessons.findIndex(l => (l.id && l.id === lesson.id) || (l.title && l.title === lesson.title))
        : -1;
      const displayIndex = lessonIndex >= 0 ? lessonIndex + 1 : (parseInt(lesson.id, 10) || 1);
      const workbookPage = isKs2 ? 3 + (displayIndex - 1) * 2 : (displayIndex < 3 ? 3 + displayIndex * 2 : 5 + displayIndex * 2);
      const typeInfo = getTaskTypeInfo(task, unit, lesson, workbookPage);

      // Active task badge
      const activeBadge = document.getElementById('ks2-active-task-badge');
      if (activeBadge) {
        if (isKs2) {
          activeBadge.innerHTML = \`Page \${workbookPage} &bull; Task \${taskIdx + 1} of \${currentWritingStudioTasks.length}\`;
        } else {
          activeBadge.innerHTML = \`Exam Practice &bull; \${getTaskStudioLabel(task, taskIdx, false)}\`;
        }
      }

      // Title & Subtitle/Tariff
      const titleEl = document.getElementById('writing-studio-title');
      const tariffEl = document.getElementById('writing-studio-tariff');
      if (isKs2) {
        titleEl.textContent = task.question || task.prompt || \`Historian Write-Up: \${lesson.title}\`;
        const taskTopic = task.topic ? \`\${task.topic} • \` : \`Task \${taskIdx + 1} • \`;
        tariffEl.textContent = \`Pupil Workbook Page \${workbookPage} Companion • \${taskTopic}Years 5–6 Enquiry\`;
      } else {
        titleEl.textContent = task.question || task.prompt || \`Extended Writing: \${lesson.title}\`;
        tariffEl.innerHTML = typeInfo.tariffDesc || task.tariff || (isKs3 ? \`Pupil Workbook Page \${workbookPage} &bull; Key Stage 3 Disciplinary Write-Up\` : '12-Mark Disciplinary Analysis');
      }

      // Bronze Starter
      let starter = task.starter || task.sentence_starter || scaffolding.sentence_starters?.[0] || scaffolding.steps?.[0]?.starter;
      if (!starter) {
        if (isKs2) {
          starter = \`During the Second World War, ordinary British people kept the country running because...\`;
        } else {
          starter = typeInfo.starter || \`A decisive factor explaining \${lesson.title} was...\`;
        }
      }
      document.getElementById('bronze-sentence-starter').textContent = \`"\${starter}"\`;

      const bronzeInstEl = document.getElementById('bronze-instruction');
      if (bronzeInstEl) {
        if (isKs2) {
          bronzeInstEl.textContent = 'Complete this sentence by explaining your main historical reason.';
        } else {
          bronzeInstEl.textContent = typeInfo.bronzeInstruction || 'Complete this sentence by stating your primary causal factor.';
        }
      }

      // Silver Checklist
      const checklistContainer = document.getElementById('silver-checklist');
      if (Array.isArray(task.hints) && task.hints.length > 0) {
        checklistContainer.innerHTML = task.hints.map(h => \`
          <li style="margin-bottom: 6px; line-height: 1.4;">\${h}</li>
        \`).join('');
      } else if (Array.isArray(scaffolding.steps) && scaffolding.steps.length > 0) {
        checklistContainer.innerHTML = scaffolding.steps.map(step => {
          const badge = step.letter ? \`<span style="display:inline-block; padding: 1px 6px; border-radius: 3px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-weight: 800; font-size: 0.72rem; margin-right: 6px;">\${step.letter}</span>\` : '';
          const name = step.name ? \`<strong>\${step.name}:</strong> \` : '';
          const desc = step.prompt || step.desc || step.description || '';
          return \`<li style="margin-bottom: 6px; line-height: 1.4;">\${badge}\${name}\${desc}</li>\`;
        }).join('');
      } else if (Array.isArray(scaffolding.structure_strip) && scaffolding.structure_strip.length > 0) {
        checklistContainer.innerHTML = scaffolding.structure_strip.map(s => \`
          <li style="margin-bottom: 6px; line-height: 1.4;">\${s}</li>
        \`).join('');
      } else if (typeInfo && Array.isArray(typeInfo.defaultChecklist) && typeInfo.defaultChecklist.length > 0) {
        checklistContainer.innerHTML = typeInfo.defaultChecklist.map(step => {
          const badge = step.letter ? \`<span style="display:inline-block; padding: 1px 6px; border-radius: 3px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-weight: 800; font-size: 0.72rem; margin-right: 6px;">\${step.letter}</span>\` : '';
          const name = step.name ? \`<strong>\${step.name}:</strong> \` : '';
          const desc = step.desc || step.prompt || '';
          return \`<li style="margin-bottom: 6px; line-height: 1.4;">\${badge}\${name}\${desc}</li>\`;
        }).join('');
      } else if (stagesData.length >= 3) {
        const first = stagesData[0];
        const mid = stagesData[Math.floor(stagesData.length / 2)];
        const last = stagesData[stagesData.length - 1];

        if (isKs2) {
          checklistContainer.innerHTML = \`
            <li>Mention what happened during: <strong>\${first.words[0]?.term || first.title}</strong></li>
            <li>Explain the role of: <strong>\${mid.words[0]?.term || mid.title}</strong></li>
            <li>Describe the impact of: <strong>\${last.words[0]?.term || last.title}</strong></li>
          \`;
        } else {
          checklistContainer.innerHTML = \`
            <li>Did you reference the initial crisis: <strong>\${first.words[0]?.term || first.title}</strong>?</li>
            <li>Did you explain the central turning point: <strong>\${mid.words[0]?.term || mid.title}</strong>?</li>
            <li>Did you analyze the final resolution: <strong>\${last.words[0]?.term || last.title}</strong>?</li>
          \`;
        }
      }

      // Gold Explanation
      let goldPrompt = task.examiner_tip || task.gold_challenge || task.hints?.[2] || typeInfo.goldPrompt || task.prompt || scaffolding.sentence_starters?.[4];
      if (!goldPrompt || isKs2) {
        goldPrompt = isKs2
          ? 'Historian Challenge: Link your facts together using powerful connectives like "As a result" or "Because of this" to show cause and effect.'
          : (typeInfo.goldPrompt || 'Deploy precise historical vocabulary to substantiate your criteria-led judgement.');
      }
      document.getElementById('gold-explanation-sample').textContent = \`"\${goldPrompt}"\`;

      const goldInstEl = document.getElementById('gold-instruction');
      if (goldInstEl) {
        if (isKs2) {
          goldInstEl.textContent = 'Use strong primary connectives to explain WHY this made a difference.';
        } else {
          goldInstEl.textContent = typeInfo.goldInstruction || 'Use high-level connectives like Consequently, Crucially, and This proved decisive because...';
        }
      }

      // Configure Write-up pad lines based on Key Stage
      const spacingBadge = document.getElementById('writeup-line-spacing-badge');
      if (textarea && spacingBadge) {
        if (isKs2) {
          textarea.className = 'ruled-writing-area ks2-ruled';
          spacingBadge.textContent = '(Primary 11mm Wide Ruled Lines)';
          textarea.placeholder = \`Write your historian answer for \${task.tag || 'this task'} here using your Bronze starter and facts...\`;
        } else {
          textarea.className = 'ruled-writing-area ks3-ruled';
          spacingBadge.textContent = typeInfo.spacingBadge || '(Secondary 7.5mm Ruled Lines)';
          textarea.placeholder = typeInfo.placeholder || \`Draft your analytical paragraph here deploying your causal connectives and evidence...\`;
        }
        textarea.value = userDraftsByTask[taskIdx] || '';
      }

      // Concepts / Key Vocabulary Bank: prioritize task-specific key terms!
      const taskKeyTerms = Array.isArray(task.key_terms) ? task.key_terms : [];
      const lessonVocabs = (lesson.vocab || lesson.vocabulary || []).map(v => typeof v === 'string' ? v : (v.term || v.name));
      const combinedVocabs = Array.from(new Set([...taskKeyTerms, ...lessonVocabs]));

      const conceptsContainer = document.getElementById('palette-chips-concepts');
      if (conceptsContainer) {
        conceptsContainer.innerHTML = combinedVocabs.slice(0, 8).map(term => {
          const def = resolveConceptDefinition(term, lesson, stagesData);
          return \`<span class="palette-chip" onclick="showWordHelp('\${term.replace(/'/g, "\\\\'")}', '\${def.replace(/'/g, "\\\\'")}')">\${term}</span>\`;
        }).join('');
      }

      // Render Trigger Word Tracker Pills
      renderWriteupTrackerPills();

      // Model Essay / WAGOLL
      const rawModel = task.model_answer || task.model || stagesData.map(s => s.modelSentence).join(' ');
      const formattedModel = formatModelEssayWithLayers(rawModel, scaffolding, lesson);
      document.getElementById('model-essay-content').innerHTML = formattedModel;
      filterModelLayers('all');

      // Update model title for KS2
      const modelTitleSpan = document.querySelector('.exemplar-model-container span');
      if (modelTitleSpan) {
        modelTitleSpan.innerHTML = isKs2
          ? \`<i class="fa-solid fa-file-signature"></i> Exemplar Historian Paragraph (WAGOLL) &bull; Task \${taskIdx + 1}\`
          : '<i class="fa-solid fa-file-signature"></i> Exemplar Model Paragraph';
      }
    }

    function renderWriteupTrackerPills() {
      const container = document.getElementById('writeup-tracker-pills');
      if (!container) return;

      const currentTask = currentWritingStudioTasks[currentWritingStudioTaskIndex] || {};
      const typeInfo = getTaskTypeInfo(currentTask, activeUnitData || {}, activeLesson || {});
      let uniqueTerms = [];

      if (Array.isArray(currentTask.key_terms) && currentTask.key_terms.length > 0) {
        uniqueTerms = currentTask.key_terms;
      } else if (typeInfo && Array.isArray(typeInfo.trackerTerms) && typeInfo.trackerTerms.length > 0) {
        uniqueTerms = typeInfo.trackerTerms;
      } else {
        const triggerTerms = [];
        stagesData.forEach(s => {
          if (s.words && s.words[0]?.term) {
            const rawTerm = s.words[0].term.trim();
            if (rawTerm.split(/\\s+/).length <= 4) {
              triggerTerms.push(rawTerm);
            }
          }
        });
        if (triggerTerms.length === 0 && activeLesson && Array.isArray(activeLesson.vocab) && activeLesson.vocab.length > 0) {
          activeLesson.vocab.slice(0, 3).forEach(v => {
            const vt = typeof v === 'string' ? v : (v.term || v.name);
            if (vt) triggerTerms.push(vt);
          });
        }
        uniqueTerms = Array.from(new Set(triggerTerms)).slice(0, 3);
      }

      const textarea = document.getElementById('pupil-writeup-textarea');
      const text = (textarea ? textarea.value : '').toLowerCase();

      container.innerHTML = uniqueTerms.map(t => {
        const cleanT = t.toLowerCase().trim();
        const withoutParen = cleanT.replace(/\\(.*?\\)/g, '').trim();
        const parenMatch = cleanT.match(/\\((.*?)\\)/);
        const acronym = parenMatch ? parenMatch[1].trim().toLowerCase() : '';

        // Flexible semantic checking
        let isIncluded = text.includes(cleanT) || 
          (withoutParen.length > 3 && text.includes(withoutParen)) || 
          (acronym.length >= 2 && text.includes(acronym));

        if (!isIncluded) {
          if (cleanT.includes('first inference') || cleanT.includes('inference 1')) {
            isIncluded = text.includes('infer') || text.includes('deduce') || text.includes('(i)');
          } else if (cleanT.includes('quote 1') || cleanT.includes('supporting quote') || cleanT.includes('source quote 1')) {
            isIncluded = text.includes('details in the source') || text.includes('tell me this') || text.includes('"') || text.includes('quote');
          } else if (cleanT.includes('second inference') || cleanT.includes('inference 2')) {
            isIncluded = text.includes('(ii)') || text.includes('second') || (text.split('infer').length > 2);
          } else if (cleanT.includes('quote 2') || cleanT.includes('source quote 2')) {
            isIncluded = (text.split('"').length > 4) || (text.split('details in the source').length > 2);
          } else if (cleanT.includes('feature 1')) {
            isIncluded = text.includes('one') || text.includes('feature') || text.includes('(i)');
          } else if (cleanT.includes('feature 2')) {
            isIncluded = text.includes('second') || text.includes('another') || text.includes('(ii)');
          }
        }

        if (isIncluded) {
          return \`<span class="tracker-pill included"><i class="fa-solid fa-check"></i> \${t}</span>\`;
        } else {
          return \`<span class="tracker-pill missing"><i class="fa-regular fa-circle"></i> \${t}</span>\`;
        }
      }).join('');

      const countEl = document.getElementById('writeup-word-count');
      if (countEl && textarea) {
        const words = textarea.value.trim().split(/\\s+/).filter(Boolean).length;
        countEl.textContent = \`Words: \${words}\`;
      }
    }\`;

const targets = [
  path.join(ROOT, 'public', 'interactive_mats', 'viewer.html'),
  path.join(ROOT, 'dist', 'interactive_mats', 'viewer.html')
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing file:', filePath);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const startStr = '    let currentWritingStudioTaskIndex = 0;';
  const endStr = '    function setupWriteupPadListener() {';
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr);
  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in', filePath);
    return;
  }
  const updated = content.slice(0, startIdx) + replacementCode + '\n\n' + content.slice(endIdx);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log('✅ Successfully updated:', filePath);
});

