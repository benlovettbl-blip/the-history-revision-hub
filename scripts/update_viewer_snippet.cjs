const fs = require('fs');
const path = require('path');

const snippet = `    let currentWritingStudioTaskIndex = 0;
    let currentWritingStudioTasks = [];
    const userDraftsByTask = {};

    function cleanCausalTopic(task, lesson) {
      let text = (task?.question || task?.prompt || task?.text || task?.title || '').trim();
      if (text) {
        text = text.replace(/\\[\\d+\\s*marks?.*?\\]/gi, '').trim();
        text = text.replace(/^[0-9]+[a-z]?\\.\\s*/i, '').trim();
        text = text.replace(/^explain\\s+/i, '').trim();
        if (/^why\\s+/i.test(text)) {
          return text.replace(/[?.!]+$/, '').trim();
        }
      }
      let title = (lesson?.title || 'this development').trim();
      title = title.replace(/^\\d{4}\\s*(&|and|-|–)?\\s*/i, '').trim();
      title = title.replace(/^KT\\s*\\d+(\\.\\d+)?:\\s*/i, '').trim();
      title = title.replace(/^Key Topic\\s*\\d+(\\.\\d+)?:\\s*/i, '').trim();
      title = title.replace(/^Enquiry\\s*\\d+:\\s*/i, '').trim();
      if (/why did\\s+/i.test(title)) {
        const m = title.match(/why did\\s+([a-zA-Z\\s]+?)\\s+(\\w+)\\??$/i);
        if (m) {
          const subject = m[1].trim();
          const verb = m[2].trim();
          const pastVerb = verb === 'win' ? 'won' : (verb === 'lose' ? 'lost' : (verb.endsWith('e') ? verb + 'd' : verb + 'ed'));
          return \`why \${subject} \${pastVerb}\`;
        }
      }
      if (/how did\\s+/i.test(title)) {
        const m = title.match(/how did\\s+(.*?)\\??$/i);
        if (m) {
          return \`how \${m[1].trim()}\`;
        }
      }
      return title.replace(/[?.!]+$/, '').trim();
    }

    function extractStatementFocus(question, fallback = 'this statement') {
      if (!question) return fallback;
      const cleanQ = question.replace(/^[0-9]+[a-z]?\\.\\s*/i, '').trim();
      const match = cleanQ.match(/['"‘“](.*?)['"’”]/);
      if (match && match[1].trim().length > 8) {
        return match[1].trim().replace(/\\.+$/, '').trim();
      }
      const agreeMatch = cleanQ.match(/^(.*?)(?:,\\s*)?(?:how far do you agree|\\?|\\[)/i);
      if (agreeMatch && agreeMatch[1].trim().length > 15 && !agreeMatch[1].toLowerCase().includes('interpretation')) {
        return agreeMatch[1].trim().replace(/\\.+$/, '');
      }
      return fallback;
    }

    function extractQuestionTopic(task, fallback = 'this development') {
      const q = (task?.question || task?.prompt || task?.text || task?.title || '').trim();
      if (!q) return fallback;
      const cleanQ = q.replace(/\\[\\d+\\s*marks?.*?\\]/gi, '').replace(/^[0-9]+[a-z]?\\.\\s*/i, '').trim();
      
      const matchAbout = cleanQ.match(/about\\s+(.*?)(?:\\.|\\?|Explain|$|\\[)/i);
      if (matchAbout && matchAbout[1].trim().length > 3) return matchAbout[1].trim();

      const matchDiffer = cleanQ.match(/differ\\s+(?:about|on)\\s+(.*?)(?:\\s+and\\s+suggest|\\.|\\?|$|\\[)/i);
      if (matchDiffer && matchDiffer[1].trim().length > 3) return matchDiffer[1].trim();

      const matchFollowUp = cleanQ.match(/find out more about\\s+(.*?)(?:\\.|\\?|$|\\[)/i);
      if (matchFollowUp && matchFollowUp[1].trim().length > 3) return matchFollowUp[1].trim();

      const matchFeature = cleanQ.match(/(?:key\\s+)?feature of\\s+(.*?)(?:\\.|\\?|\\[|$)/i);
      if (matchFeature && matchFeature[1].trim().length > 3) return matchFeature[1].trim();

      const matchConsequence = cleanQ.match(/consequence of\\s+(.*?)(?:\\.|\\?|\\[|$)/i);
      if (matchConsequence && matchConsequence[1].trim().length > 3) return matchConsequence[1].trim();

      const matchImportance = cleanQ.match(/importance of\\s+(.*?)(?:\\.|\\?|\\[|$)/i);
      if (matchImportance && matchImportance[1].trim().length > 3) return matchImportance[1].trim();

      const matchComparison = cleanQ.match(/in which\\s+(.*?)\\s+(?:were|was)\\s+(?:similar|different)/i);
      if (matchComparison && matchComparison[1].trim().length > 3) return matchComparison[1].trim();

      return fallback;
    }

    function cleanStimulusTerm(str) {
      if (!str) return 'Key Factor';
      let clean = str.replace(/\\(.*?\\)/g, '').trim();
      clean = clean.replace(/^(Source\\s+[A-Z]:?|The|Extract from)\\s+/i, '').trim();
      const parts = clean.split(/[,;]|(?:\\s+and\\s+)/i);
      let phrase = parts[0].trim();
      const words = phrase.split(/\\s+/);
      if (words.length > 4) {
        phrase = words.slice(0, 4).join(' ');
      }
      phrase = phrase.replace(/[\\s,.-]+$/, '');
      phrase = phrase.replace(/\\s+(of|in|by|for|from|with|to|at)$/i, '');
      return phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }

    function getTaskStudioLabel(t, idx, isKs2, isKs3 = false) {
      if (isKs2) {
        const isBigQ = idx === 3 || (t.tag && t.tag.toLowerCase().includes('challenge')) || (t.type && t.type.toLowerCase().includes('big'));
        const defaultLabel = isBigQ ? '★ 4. The Big Question' : \`Task \${idx + 1}\`;
        return t.tag ? \`\${idx + 1}. \${t.tag}\` : defaultLabel;
      }
      
      const q = (t.question || t.prompt || t.text || t.title || '').trim();
      const text = (q + ' ' + (t.type || '') + ' ' + (t.tariff || '') + ' ' + (t.topic || '')).toLowerCase();
      
      // Preserve explicit part labels like 1(a), 1(b), 3(b), 3(c), 3(d)
      const partMatch = q.match(/^([0-9]+[a-z]?|[a-z])\\./i) || (t.tariff || '').match(/^([0-9]+[a-z]?|[a-z]):/i);
      const prefix = partMatch ? \`Q\${partMatch[1].toUpperCase()}\` : \`Q\${idx + 1}\`;

      // 1. Interpretations Evaluative Essay (16m)
      if (text.includes('interpretation') && (text.includes('agree') || text.includes('16 marks') || t.marks === 16)) {
        return isKs3 ? \`\${idx + 1}. Evaluative Essay (16m)\` : \`\${prefix}: Evaluative Essay (16m)\`;
      }

      // 2. Interpretations Difference (4m)
      if (text.includes('interpretation') && (text.includes('differ') || text.includes('difference')) && !text.includes('reason') && !text.includes('8 marks') && !text.includes('8m')) {
        return isKs3 ? \`\${idx + 1}. Interpretations Diff (4m)\` : \`\${prefix}: Interpretations Diff (4m)\`;
      }

      // 3. Interpretations Reason for Difference (4m)
      if (text.includes('interpretation') && (text.includes('reason') || text.includes('suggest one reason')) && (text.includes('4') || t.marks === 4)) {
        return isKs3 ? \`\${idx + 1}. Reason for Diff (4m)\` : \`\${prefix}: Reason for Diff (4m)\`;
      }

      // 4. Contrasting Interpretations (8m)
      if (text.includes('interpretation') && (text.includes('8') || t.type?.includes('interpretations'))) {
        return isKs3 ? \`\${idx + 1}. Interpretations (8m)\` : \`\${prefix}: Interpretations (8m)\`;
      }

      // 5. Source Follow-Up (4m - Paper 1 Historic Environment)
      if (text.includes('follow up') || text.includes('find out more about')) {
        return isKs3 ? \`\${idx + 1}. Source Follow-Up (4m)\` : \`\${prefix}: Source Follow-Up (4m)\`;
      }

      // 6. Evaluative Essay (Statement + "How far do you agree?")
      if (text.includes('how far do you agree') || text.includes('how far do you') || t.type?.includes('evaluative') || t.type?.includes('judgement') || t.type?.includes('verdict') || /^['"‘“]/.test(q)) {
        const marks = text.includes('16') ? '16m' : '12m';
        return isKs3 ? \`\${idx + 1}. Evaluative Essay (\${marks})\` : \`\${prefix}: Evaluative Essay (\${marks})\`;
      }

      // 7. Check 2-mark feature drills
      if (t.type === 'feature_2m' || text.includes('2 mark') || text.includes('one key feature') || text.includes('describe one key feature')) {
        return isKs3 ? \`\${idx + 1}. Key Feature (2m)\` : \`\${prefix}: Key Feature (2m)\`;
      }

      // 8. Check consequences
      if (text.includes('consequence')) {
        const marks = (t.tariff && t.tariff.includes('8')) || text.includes('two consequences') ? '8m' : '4m';
        return isKs3 ? \`\${idx + 1}. Consequence (\${marks})\` : \`\${prefix}: Consequence (\${marks})\`;
      }

      // 9. Source inference (Paper 3)
      if (text.includes('infer') || t.type === 'inference_4m' || (text.includes('source') && text.includes('4 mark'))) {
        return isKs3 ? \`\${idx + 1}. Source Inference (4m)\` : \`\${prefix}: Source Inference (4m)\`;
      }

      // 10. Two features (Paper 1 / Paper 2)
      if (text.includes('two features') || text.includes('feature_drills') || text.includes('two_features')) {
        return isKs3 ? \`\${idx + 1}. Two Features (4m)\` : \`\${prefix}: Two Features (4m)\`;
      }

      // 11. Comparison / Similarity & Difference (Paper 1 Medicine)
      if (text.includes('similar') || text.includes('similarity_difference') || text.includes('explain one way')) {
        return isKs3 ? \`\${idx + 1}. Comparison (4m)\` : \`\${prefix}: Comparison (4m)\`;
      }

      // 12. Source Utility (Paper 1 / Paper 3)
      if (text.includes('useful') || text.includes('utility')) {
        return isKs3 ? \`\${idx + 1}. Source Utility (8m)\` : \`\${prefix}: Source Utility (8m)\`;
      }

      // 13. Narrative Account (Paper 2)
      if (text.includes('narrative')) {
        return isKs3 ? \`\${idx + 1}. Narrative Account (8m)\` : \`\${prefix}: Narrative Account (8m)\`;
      }

      // 14. Explain Importance (Paper 2)
      if (text.includes('importance')) {
        return isKs3 ? \`\${idx + 1}. Explain Importance (8m)\` : \`\${prefix}: Explain Importance (8m)\`;
      }

      // 15. 12-mark Causal Explanation
      if (text.includes('12 marks') || text.includes('causation') || text.includes('explain why')) {
        return isKs3 ? \`\${idx + 1}. Causal Explanation (12m)\` : \`\${prefix}: Causal Explanation (12m)\`;
      }
      
      if (t.tag) return isKs3 ? \`\${idx + 1}. \${t.tag}\` : \`\${prefix}: \${t.tag}\`;
      if (t.tariff) return isKs3 ? \`\${idx + 1}. \${t.tariff}\` : \`\${prefix}: \${t.tariff}\`;
      return isKs3 ? \`Task \${idx + 1}\` : \`\${prefix}\`;
    }

    function getTaskTypeInfo(task, unit, lesson, workbookPage = 3) {
      const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
      const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.keyStage || '').toLowerCase().includes('ks3') || /year\\s*[789]\\b/i.test(unit.year_group || unit.yearGroup || ''));
      if (isKs2) return { type: 'ks2' };

      const qRaw = (task.question || task.prompt || task.text || task.title || '').trim();
      const tariffStr = (task.tariff || (task.marks ? \`\${task.marks} marks\` : '') || '').toLowerCase();
      const typeStr = (task.type || '').toLowerCase();
      const qText = (qRaw + ' ' + tariffStr + ' ' + typeStr + ' ' + (task.topic || '')).toLowerCase();

      // Determine tracker terms early so any task gets clean concepts
      let tracker = [];
      if (Array.isArray(task.key_terms) && task.key_terms.length > 0) {
        tracker = task.key_terms;
      } else if (Array.isArray(task.stimulus) && task.stimulus.length >= 2) {
        tracker = [cleanStimulusTerm(task.stimulus[0]), cleanStimulusTerm(task.stimulus[1]), 'Own Knowledge'];
      }

      // 1. Interpretations Evaluative Essay (16m + 4 SPaG) - Paper 3 Weimar / USA Q3(d)
      if ((qText.includes('interpretation') || qText.includes('interpretations')) &&
          (qText.includes('how far do you agree') || qText.includes('agree with interpretation') || qText.includes('16 marks') || task.marks === 16)) {
        const topic = extractQuestionTopic(task, lesson.title || 'this historical debate');
        const tariffLabel = isKs3
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 9'}) &bull; Interpretations Evaluative Essay [16 marks]\`
          : \`Edexcel GCSE Paper 3 &bull; Q3(d): Evaluative Essay on Interpretations [16 marks + 4 SPaG]\`;

        return {
          type: 'interpretation_evaluative_16m',
          tariffDesc: tariffLabel,
          starter: \`Interpretation 2 argues that \${topic} was primarily... because... On the other hand, Interpretation 1 offers an alternative perspective, suggesting that...\`,
          bronzeInstruction: 'State the core argument of Interpretation 2 on this issue, and compare it with the perspective given in Interpretation 1.',
          defaultChecklist: [
            { letter: 'I2', name: 'Interpretation 2 Analysis', desc: 'Analyse the viewpoint and arguments of Interpretation 2 using quotes and detail.' },
            { letter: 'OK', name: 'Contextual Knowledge', desc: 'Deploy precise historical facts beyond the interpretations to evaluate both views.' },
            { letter: 'I1', name: 'Interpretation 1 Evaluation', desc: 'Analyse the alternative perspective in Interpretation 1 with quotes and evidence.' },
            { letter: 'J', name: 'Sustained Judgement', desc: 'Reach a substantiated conclusion on how far you agree with Interpretation 2 and which interpretation is more convincing in context.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Historian Challenge: Level 4 requires evaluating the interpretations in their historical context. Explain which interpretation provides a more convincing or comprehensive view, rather than simply labeling one as right or wrong.",
          goldInstruction: "Structure a balanced, historiographical argument evaluating the persuasiveness of both interpretations against the historical evidence.",
          placeholder: \`Section 1 (Interpretation 2): Interpretation 2 argues that...\\nDeploy quotes and own knowledge to evaluate this claim...\\n\\nSection 2 (Interpretation 1): However, Interpretation 1 presents a different view, suggesting that...\\nDeploy quotes and own knowledge to evaluate this alternative claim...\\n\\nConclusion: On balance, I agree / disagree with Interpretation 2 because...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Historiographical Evaluation [16m + 4 SPaG])',
          trackerTerms: tracker.length > 0 ? tracker : ['Interpretation 2', 'Interpretation 1', 'Contextual Knowledge', 'Final Judgement']
        };
      }

      // 2. Interpretations Difference (4m) - Paper 3 Weimar Q3(b)
      if ((qText.includes('interpretation') || qText.includes('interpretations')) &&
          (qText.includes('differ') || qText.includes('difference')) &&
          !qText.includes('suggest one reason') &&
          !qText.includes('why they differ') &&
          (tariffStr.includes('4') || task.marks === 4 || !tariffStr.includes('8'))) {
        const topic = extractQuestionTopic(task, 'this historical issue');
        const tariffLabel = isKs3
          ? \`Key Stage 3 Enquiry &bull; Interpretations Difference [4 marks]\`
          : \`Edexcel GCSE Paper 3 &bull; Q3(b): Difference Between Interpretations [4 marks]\`;

        return {
          type: 'interpretation_diff_4m',
          tariffDesc: tariffLabel,
          starter: \`The main difference between Interpretations 1 and 2 is that Interpretation 1 suggests that..., whereas Interpretation 2 argues that...\`,
          bronzeInstruction: 'State the central point of contrast clearly, then quote or reference specific evidence from both extracts.',
          defaultChecklist: [
            { letter: 'D', name: 'Main Difference', desc: 'Clearly identify the primary point of disagreement or contrast.' },
            { letter: 'I1', name: 'Interpretation 1 Detail', desc: 'Quote or reference details from Interpretation 1 showing this view.' },
            { letter: 'I2', name: 'Interpretation 2 Detail', desc: 'Quote or reference details from Interpretation 2 showing the contrasting view.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Keep it tightly focused on the DIFFERENCE in viewpoint. Do not explain reasons why or assess reliability/utility; simply identify the clear difference and support with details from both.",
          goldInstruction: "Ensure both interpretations are quoted or paraphrased precisely to demonstrate the contrast.",
          placeholder: \`The main difference between Interpretations 1 and 2 is that Interpretation 1 suggests that...\\nInterpretation 1 states: "..."\\n\\nBy contrast, Interpretation 2 argues that...\\nInterpretation 2 states: "..."\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Interpretations Comparison [4 marks])',
          trackerTerms: tracker.length > 0 ? tracker : ['Main Difference', 'Interpretation 1', 'Interpretation 2']
        };
      }

      // 3. Interpretations Reason for Difference (4m) - Paper 3 Weimar Q3(c)
      if ((qText.includes('interpretation') || qText.includes('interpretations')) &&
          (qText.includes('suggest one reason') || qText.includes('why') || qText.includes('reason why')) &&
          (tariffStr.includes('4') || task.marks === 4)) {
        const topic = extractQuestionTopic(task, 'this development');
        const tariffLabel = isKs3
          ? \`Key Stage 3 Enquiry &bull; Reason for Difference [4 marks]\`
          : \`Edexcel GCSE Paper 3 &bull; Q3(c): Reason for Difference [4 marks]\`;

        return {
          type: 'interpretation_reason_4m',
          tariffDesc: tariffLabel,
          starter: \`One reason why Interpretations 1 and 2 differ is that the historians have focused on different aspects of \${topic}, with Interpretation 1 emphasizing..., while Interpretation 2 focuses on...\`,
          bronzeInstruction: 'Suggest a valid reason for the difference (different sources, emphasis, or perspective), and support it with reference to the extracts.',
          defaultChecklist: [
            { letter: 'R', name: 'Reason for Disagreement', desc: 'State why the historians reach different conclusions (different sources, emphasis on different groups, or differing perspectives).' },
            { letter: 'E', name: 'Evidence from Interpretations', desc: 'Support your reason by referring to what each interpretation focuses on.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Level 2 requires explaining WHY the interpretations differ (e.g. the authors have investigated different aspects of the topic or drawn on different types of evidence).",
          goldInstruction: "State the reason clearly, then explain how each interpretation reflects that different perspective or evidence base.",
          placeholder: \`One reason why Interpretations 1 and 2 differ is that the authors have focused on different aspects of \${topic}.\\n\\nInterpretation 1 focuses on... which leads them to conclude that...\\n\\nBy contrast, Interpretation 2 focuses on... which explains why they argue that...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Historiographical Analysis [4 marks])',
          trackerTerms: tracker.length > 0 ? tracker : ['Reason for Difference', 'Different Focus', 'Supporting Reference']
        };
      }

      // 4. Combined Contrasting Interpretations (8m)
      if ((qText.includes('interpretation') || qText.includes('interpretations')) &&
          (tariffStr.includes('8') || typeStr.includes('interpretations') || qText.includes('contrasting interpretations'))) {
        const topic = extractQuestionTopic(task, lesson.title || 'this historical issue');
        const tariffLabel = isKs3
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 8'}) &bull; Contrasting Interpretations [8 marks]\`
          : \`Edexcel GCSE &bull; Contrasting Interpretations [8 marks]\`;

        return {
          type: 'interpretation_contrasting_8m',
          tariffDesc: tariffLabel,
          starter: \`Interpretations 1 and 2 differ fundamentally on \${topic} because Interpretation 1 argues that..., whereas Interpretation 2 suggests that... A key reason for this disagreement is that...\`,
          bronzeInstruction: 'Analyse the key difference in argument with evidence from both extracts, then explain why the historians reached contrasting conclusions.',
          defaultChecklist: [
            { letter: 'D', name: 'Difference in Views', desc: 'Contrast the arguments of Interpretations 1 and 2 with specific quotes.' },
            { letter: 'R', name: 'Reason for Disagreement', desc: 'Explain why the authors reached different conclusions (different focus, sources, or perspective).' },
            { letter: 'J', name: 'Contextual Evaluation', desc: 'Support your analysis with precise historical facts from the period.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Historian Challenge: Synthesise both the historiographical difference AND the reasons for the historians' differing perspectives using precise contextual evidence.",
          goldInstruction: "Demonstrate how the historians' distinct viewpoints arise from different source selections and historical emphases.",
          placeholder: \`Difference in Arguments: Interpretation 1 suggests that...\\nBy contrast, Interpretation 2 argues that...\\n\\nReason for Contrast: A primary reason for this disagreement is that the authors focus on different aspects of \${topic}...\\n\\nContextual Evaluation: Historical evidence from the period supports...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Contrasting Interpretations [8 marks])',
          trackerTerms: tracker.length > 0 ? tracker : ['Difference in Views', 'Interpretation 1', 'Interpretation 2', 'Reason for Difference']
        };
      }

      // 5. Source Follow-Up (4m) - Edexcel Paper 1 Historic Environment
      if (qText.includes('follow up') || qText.includes('find out more about')) {
        const topic = extractQuestionTopic(task, 'this medical condition');
        const tariffLabel = isKs3
          ? \`Key Stage 3 Enquiry &bull; Source Follow-Up [4 marks]\`
          : \`Edexcel GCSE Paper 1 Historic Environment &bull; Q2(a): Source Follow-Up [4 marks]\`;

        return {
          type: 'source_followup_4m',
          tariffDesc: tariffLabel,
          starter: \`Detail in Source that I would follow up: "..."\\nQuestion I would ask: ...\\nType of source I would look for: ...\\nHow this would help: This would help me understand...\`,
          bronzeInstruction: 'Identify one specific detail to investigate, formulate a precise question, name an authentic contemporary source, and explain its value.',
          defaultChecklist: [
            { letter: 'D', name: 'Detail to Follow Up', desc: 'Quote an exact detail directly from the source text or picture.' },
            { letter: 'Q', name: 'Historical Question', desc: 'Formulate a question directly answering that specific detail.' },
            { letter: 'S', name: 'Specific Historical Source', desc: 'Name a genuine contemporary historical record (e.g. RAMC war diaries, casualty clearing station logs).' },
            { letter: 'H', name: 'How it Helps', desc: 'Explain how that source answers your enquiry question.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: All four parts must connect in a tight chain. Do not write vague answers like 'look on the internet' or 'ask a soldier'. Name an authentic contemporary source type.",
          goldInstruction: "Ensure your question directly stems from the quoted detail, and your chosen source can realistically answer that question.",
          placeholder: \`Detail in Source that I would follow up:\\n"..."\\n\\nQuestion I would ask:\\n...\\n\\nType of source I would look for:\\n... [e.g. RAMC unit war diaries, casualty admission registers, medical officer reports]\\n\\nHow this would help:\\nThis would help me understand...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • 4-Part Source Follow-Up [4 marks])',
          trackerTerms: tracker.length > 0 ? tracker : ['Detail to Follow Up', 'Historical Question', 'Specific Source Type', 'Historical Value']
        };
      }

      // 6. Evaluative Essay (Statement + "How far do you agree?") - PRIORITY CHECK
      const isEvaluative = qText.includes('how far do you agree') ||
                           qText.includes('how far do you') ||
                           typeStr.includes('evaluative') ||
                           typeStr.includes('judgement') ||
                           typeStr.includes('verdict') ||
                           typeStr.includes('two_sided_argument') ||
                           /^['"‘“]/.test(qRaw.trim()) ||
                           qRaw.includes('How far do you agree');

      if (isEvaluative) {
        const is16m = qText.includes('16') || task.marks === 16;
        const marks = is16m ? '16 marks (+4 SPaG)' : (task.tariff ? task.tariff.replace(/.*\\[(\\d+\\s*marks?)\\].*/i, '$1') : '12 marks');
        const statement = extractStatementFocus(qRaw, lesson.title || 'this view');
        const tariffLabel = isKs3
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 7'}) &bull; Evaluative Judgement Essay [\${marks}]\`
          : (is16m ? 'Edexcel GCSE &bull; 16-Mark Evaluative Essay (+4 SPaG)' : \`Edexcel GCSE &bull; Evaluative Essay [\${marks}]\`);

        return {
          type: 'essay_evaluative',
          tariffDesc: tariffLabel,
          starter: \`It can be argued that \${statement} because... However, an alternative view is that...\`,
          bronzeInstruction: 'Establish your criteria-led line of argument and introduce both sides of the historical debate.',
          defaultChecklist: [
            { letter: 'T', name: 'Thesis / Introduction', desc: 'Define your criteria and state your initial overall judgement on the statement.' },
            { letter: 'A', name: 'Arguments For Statement', desc: 'Analyse the named factor in the statement with precise historical evidence.' },
            { letter: 'C', name: 'Counter-Arguments', desc: 'Analyse alternative factors or counter-evidence with detailed historical facts.' },
            { letter: 'J', name: 'Sustained Judgement', desc: 'Reach a nuanced conclusion weighing which factor was most decisive.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Historian Challenge: A Level 4 judgement is criteria-led: establish explicit criteria to weigh which factor was fundamentally more decisive.",
          goldInstruction: "Structure a balanced, criteria-led argument using evaluative language ('fundamentally', 'predominantly', 'outweighed by').",
          placeholder: \`Introduction & Thesis: State your line of argument...\\n\\nSection 1 (Statement Claim): Explain the evidence supporting the prompt...\\n\\nSection 2 (Alternative Factors): Evaluate other significant causes...\\n\\nConclusion: Provide your substantiated final judgement...\`,
          spacingBadge: \`(Secondary 7.5mm Ruled Lines • Evaluative Essay [\${marks}])\`,
          trackerTerms: tracker.length > 0 ? tracker : ['Thesis Statement', 'Named Factor', 'Alternative Factor', 'Final Judgement']
        };
      }

      // 7. One Key Feature (2 marks) - e.g. Edexcel GCSE Paper 2 Early Elizabethan England Q1(a) and Q1(b)
      if (typeStr === 'feature_2m' || tariffStr.includes('2 mark') || qText.includes('one key feature') || qText.includes('one feature') || (task.marks === 2 && qText.includes('feature'))) {
        const topic = extractQuestionTopic(task, lesson.title || 'this feature');
        const tariffLabel = isKs3
          ? \`Key Stage 3 Enquiry &bull; Key Feature [2 marks]\`
          : \`Edexcel GCSE Paper 2 &bull; Q1: One Key Feature [2 marks]\`;
        return {
          type: 'feature_2m',
          tariffDesc: tariffLabel,
          starter: \`One key feature of \${topic} was that...\`,
          starterHelper: \`Follow with: "For example, ... [give specific historical detail]"\`,
          bronzeInstruction: 'Identify one feature clearly, then support it with one specific factual detail.',
          defaultChecklist: [
            { letter: 'F', name: 'Key Feature (Point)', desc: \`Clearly state one valid feature or characteristic of \${topic}.\` },
            { letter: 'D', name: 'Supporting Detail (Evidence)', desc: 'Provide precise supporting factual detail, names, numbers, or dates.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Keep it concise and precise. You only need ONE feature and ONE supporting factual detail for full 2/2 marks.",
          goldInstruction: "Avoid writing a long paragraph; stay focused strictly on the feature and its detail.",
          placeholder: \`One key feature of \${topic} was that...\\n\\nFor example, ... [provide specific factual detail here]\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Feature + Detail Format)',
          trackerTerms: tracker.length > 0 ? tracker : ['Key Feature', 'Supporting Detail']
        };
      }

      // 8. Source Inference (4 marks) - e.g. Edexcel GCSE Paper 3 Section A Q1
      if (qText.includes('infer') || typeStr.includes('inference') || (task.marks === 4 && qText.includes('source') && !qText.includes('useful'))) {
        const srcMatch = qRaw.match(/Source\\s+([A-Z])/i);
        const src = srcMatch ? \`Source \${srcMatch[1].toUpperCase()}\` : 'Source A';
        const tariffLabel = isKs3 
          ? \`Key Stage 3 Enquiry &bull; Source Inference [4 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Paper 3 Section A\` : 'Edexcel GCSE Paper 3 Section A &bull; Q1: Source Inference [4 marks]');
        return {
          type: 'inference_4m',
          tariffDesc: tariffLabel,
          starter: \`One thing I can infer from \${src} is that...\`,
          starterHelper: \`Follow with: "Details in the source that tell me this are: '...'"\`,
          bronzeInstruction: \`State your first clear deduction, then quote the exact supporting words from \${src}.\`,
          defaultChecklist: [
            { letter: 'I1', name: 'First Inference', desc: \`State what you can deduce from \${src} about the enquiry topic.\` },
            { letter: 'Q1', name: 'Supporting Detail', desc: \`Quote the exact words from \${src} that support your first inference.\` },
            { letter: 'I2', name: 'Second Inference', desc: \`State a second, different deduction from \${src}.\` },
            { letter: 'Q2', name: 'Supporting Detail', desc: \`Quote the exact words from \${src} that support your second inference.\` }
          ],
          goldPrompt: task.examiner_tip || "Examiner Tip: Give TWO completely separate inferences. An inference is what you can deduce/work out beyond the literal surface text, supported by an exact quote.",
          goldInstruction: "Avoid repeating the same point or copying words directly without deducing meaning.",
          placeholder: \`One thing I can infer from \${src} is that...\\nDetails in the source that tell me this are: "..."\\n\\nAnother thing I can infer from \${src} is that...\\nDetails in the source that tell me this are: "..."\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • 2x Inference + Quote Format)',
          trackerTerms: ['First Inference', 'Quote 1', 'Second Inference', 'Quote 2']
        };
      }

      // 9. Describe Two Features (4 marks)
      if (qText.includes('two features') || typeStr.includes('two_features') || typeStr.includes('feature_drills') || (task.marks === 4 && qText.includes('feature'))) {
        const tariffLabel = isKs3 
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 7'}) &bull; Feature Drill [4 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Paper 1 Section B\` : 'Edexcel GCSE Paper 1 Section B &bull; Q1: Two Features [4 marks]');
        return {
          type: 'features_4m',
          tariffDesc: tariffLabel,
          starter: \`One key feature of this historical development was...\`,
          starterHelper: \`Follow with: "Another key feature was..."\`,
          bronzeInstruction: 'Identify one feature clearly, then support it with specific factual detail.',
          defaultChecklist: [
            { letter: 'F1', name: 'Feature 1 (Identification)', desc: 'Clearly state your first distinct characteristic or event.' },
            { letter: 'D1', name: 'Detail 1 (Specific Knowledge)', desc: 'Support with precise historical facts, dates, names, or numbers.' },
            { letter: 'F2', name: 'Feature 2 (Identification)', desc: 'Clearly state a second, separate characteristic.' },
            { letter: 'D2', name: 'Detail 2 (Specific Knowledge)', desc: 'Support with precise supporting historical facts.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Keep features completely distinct. Do not merge them into one narrative paragraph. Give 1 feature + 1 specific detail, then a second feature + 1 specific detail.",
          goldInstruction: "Ensure both features are separated with clear signposting.",
          placeholder: \`One key feature of \${lesson.title || 'this development'} was...\\nSpecific factual detail supporting this: ...\\n\\nA second key feature was...\\nSpecific factual detail supporting this: ...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • 2x Distinct Feature Format)',
          trackerTerms: tracker.length > 0 ? tracker : ['Feature 1', 'Detail 1', 'Feature 2', 'Detail 2']
        };
      }

      // 10. Explain Consequences (4 or 8 marks)
      if (qText.includes('consequence') || typeStr.includes('consequence')) {
        const isDouble = qText.includes('two consequences') || tariffStr.includes('8') || typeStr.includes('8');
        const marks = isDouble ? '8 marks' : '4 marks';
        const tariffLabel = isKs3 
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 7'}) &bull; Consequence Analysis [\${marks}]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Paper 2\` : \`Edexcel GCSE Paper 2 &bull; Explain Consequence [\${marks}]\`);
        const topic = extractQuestionTopic(task, lesson.title || 'this event');
        return {
          type: isDouble ? 'consequences_8m' : 'consequences_4m',
          tariffDesc: tariffLabel,
          starter: \`One significant consequence of \${topic} was that...\`,
          starterHelper: isDouble ? \`Follow with: "A second consequence was..."\` : undefined,
          bronzeInstruction: isDouble ? 'Explain the first consequence with supporting evidence, then explain a second consequence.' : 'State the direct consequence clearly, then support with precise evidence of its impact.',
          defaultChecklist: isDouble ? [
            { letter: 'C1', name: 'Consequence 1', desc: 'Identify the first direct result or impact.' },
            { letter: 'E1', name: 'Evidence 1', desc: 'Support with precise historical facts explaining how it occurred.' },
            { letter: 'C2', name: 'Consequence 2', desc: 'Identify a second, distinct political, military, or social result.' },
            { letter: 'E2', name: 'Evidence 2', desc: 'Support with precise historical facts explaining its significance.' }
          ] : [
            { letter: 'C', name: 'Direct Consequence', desc: \`Identify how \${topic} directly caused a change or crisis.\` },
            { letter: 'E', name: 'Evidence & Impact', desc: 'Provide precise factual evidence explaining why this occurred and its historical significance.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: A consequence is what happened BECAUSE of the event, not the event itself. Show the causal chain of consequence.",
          goldInstruction: "Use causal language: 'This led directly to', 'As an immediate consequence', 'The long-term impact was'.",
          placeholder: \`One significant consequence of \${topic} was that...\\nThis occurred because...\\nAs a result of this development, ...\`,
          spacingBadge: \`(Secondary 7.5mm Ruled Lines • Consequence Analysis [\${marks}])\`,
          trackerTerms: tracker.length > 0 ? tracker : (isDouble ? ['Consequence 1', 'Causal Impact 1', 'Consequence 2', 'Causal Impact 2'] : ['Consequence', 'Factual Detail', 'Historical Impact'])
        };
      }

      // 11. Explain One Way / Comparison (4 marks)
      if (qText.includes('similar') || qText.includes('difference') || typeStr.includes('similarity') || (task.marks === 4 && qText.includes('explain one way'))) {
        const questionOnly = qRaw.toLowerCase();
        const isDiff = questionOnly.includes('differ');
        const compWord = isDiff ? 'different' : 'similar';
        const topic = extractQuestionTopic(task, 'ideas in these two periods');
        const tariffLabel = isKs3 
          ? \`Key Stage 3 Enquiry &bull; Historical Comparison [4 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Comparison\` : \`Edexcel GCSE Paper 1 &bull; Explain One Way in which they were \${compWord === 'different' ? 'Different' : 'Similar'} [4 marks]\`);
        return {
          type: 'comparison_4m',
          tariffDesc: tariffLabel,
          starter: \`One way in which \${topic} were \${compWord} was that...\`,
          bronzeInstruction: \`Identify a clear point of \${compWord === 'different' ? 'difference' : 'similarity'}, then support it from both periods/contexts.\`,
          defaultChecklist: [
            { letter: 'C', name: 'Comparison Point', desc: \`Identify the specific commonality or difference regarding \${topic}.\` },
            { letter: 'P1', name: 'Period 1 Evidence', desc: 'Provide precise factual evidence from the first time period.' },
            { letter: 'P2', name: 'Period 2 Evidence', desc: 'Provide precise factual evidence from the second time period.' },
            { letter: 'L', name: 'Direct Link', desc: \`Conclude by explaining why this demonstrates \${compWord === 'different' ? 'a difference' : 'a similarity'}.\` }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Avoid writing two separate mini-essays. Structure your paragraph around the CONCEPT of comparison.",
          goldInstruction: \`Use comparative signposting: '\${compWord === 'different' ? 'By contrast, In the later period, Whereas' : 'Similarly, In both periods, In like manner'}'.\`,
          placeholder: \`One way in which \${topic} were \${compWord} was that...\\nIn the first period, this was evident when...\\nBy comparison, in the second period, ...\\nThis demonstrates that...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Direct Comparative Synthesis)',
          trackerTerms: tracker.length > 0 ? tracker : ['Comparative Claim', 'Period 1 Evidence', 'Period 2 Evidence', 'Direct Synthesis']
        };
      }

      // 12. Source Utility (8 marks)
      if (qText.includes('useful') || qText.includes('utility') || typeStr.includes('utility')) {
        const tariffLabel = isKs3 
          ? \`Key Stage 3 Enquiry &bull; Source Utility [8 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Source Utility\` : 'Edexcel GCSE Paper 3 &bull; How Useful are Sources for an Enquiry [8 marks]');
        return {
          type: 'utility_8m',
          tariffDesc: tariffLabel,
          starter: \`Source A is useful to an historian studying this enquiry because it shows...\`,
          bronzeInstruction: 'Evaluate the utility of the source content, then evaluate how provenance affects reliability.',
          defaultChecklist: [
            { letter: 'C', name: 'Content & Context', desc: 'Evaluate what the source content reveals, supported by precise own knowledge.' },
            { letter: 'P', name: 'Provenance Analysis', desc: 'Evaluate who created it, when, and their purpose/motive.' },
            { letter: 'W', name: 'Weight / Reliability', desc: 'Assess how provenance strengthens or limits its historical value.' },
            { letter: 'J', name: 'Judgement', desc: 'Reach a supported conclusion on the overall utility for the enquiry.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Do not just say a source is biased and therefore useless! Provenance can make a source EXTREMELY useful for understanding contemporary attitudes.",
          goldInstruction: "Synthesize content, context, and provenance: 'While limited in scope, the source remains invaluable because...'",
          placeholder: \`Source A is useful for this enquiry because the content reveals...\\nThis is corroborated by my own knowledge that...\\nFurthermore, the provenance makes it particularly valuable because it was written by...\\nHowever, the utility is limited by...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Content + Provenance Synthesis)',
          trackerTerms: tracker.length > 0 ? tracker : ['Source Content', 'Own Knowledge', 'Provenance', 'Overall Utility']
        };
      }

      // 13. Narrative Account (8 marks)
      if (qText.includes('narrative') || typeStr.includes('narrative')) {
        const tariffLabel = isKs3 
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 7'}) &bull; Narrative Account [8 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Paper 2\` : 'Edexcel GCSE Paper 2 &bull; Write a Narrative Account [8 marks]');
        return {
          type: 'narrative_8m',
          tariffDesc: tariffLabel,
          starter: \`The chain of events began when...\`,
          bronzeInstruction: 'Construct a chronological, causal narrative linking beginning, development, and outcome.',
          defaultChecklist: [
            { letter: 'B', name: 'Beginning / Catalyst', desc: 'Explain the initial catalyst that triggered the sequence.' },
            { letter: 'D', name: 'Development / Turning Point', desc: 'Show how one event directly caused the next step.' },
            { letter: 'O', name: 'Outcome / Culmination', desc: 'Explain the final resolution or lasting consequence.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: This is not just a chronological list. You must show CAUSAL LINKS (how event A led to event B, which caused event C).",
          goldInstruction: "Use sequencing and causal connectives: 'Initially', 'This prompted', 'Following this', 'Ultimately resulting in...'",
          placeholder: \`The sequence of events began with...\\nThis directly led to...\\nAs a result of this development, ...\\nFinally, this culminated in...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • Causal Narrative Flow)',
          trackerTerms: tracker.length > 0 ? tracker : ['Catalyst Event', 'Causal Link 1', 'Causal Link 2', 'Outcome']
        };
      }

      // 14. Explain Importance (8 marks)
      if (qText.includes('importance') || typeStr.includes('importance')) {
        const topic = extractQuestionTopic(task, lesson.title || 'this historical event');
        const tariffLabel = isKs3 
          ? \`Key Stage 3 Enquiry &bull; Importance Analysis [8 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Paper 2\` : 'Edexcel GCSE Paper 2 &bull; Explain the Importance [8 marks]');
        return {
          type: 'importance_8m',
          tariffDesc: tariffLabel,
          starter: \`The importance of \${topic} was that...\`,
          bronzeInstruction: 'Explain the first way this event had major significance, then explain its wider impact.',
          defaultChecklist: [
            { letter: 'I1', name: 'First Importance', desc: \`Explain how \${topic} directly altered political relations or policy.\` },
            { letter: 'E1', name: 'Evidence & Impact', desc: 'Support with precise historical facts.' },
            { letter: 'I2', name: 'Second Importance', desc: \`Explain how \${topic} escalated tensions or caused long-term consequences.\` },
            { letter: 'E2', name: 'Evidence & Impact', desc: 'Support with precise historical facts.' }
          ],
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: Do not just tell the narrative story of what happened. You must explain WHY it was important (how it altered relations, caused escalation, or changed policy).",
          goldInstruction: "Use impact connectives: 'Crucially', 'This escalated tensions because', 'As a direct result, relations deteriorated'.",
          placeholder: \`The importance of \${topic} was that it fundamentally changed...\\nSpecifically, this was demonstrated when...\\nFurthermore, it was of vital importance because it led to...\\nConsequently, ...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • 2x Importance Analysis [8 marks])',
          trackerTerms: tracker.length > 0 ? tracker : ['First Impact', 'Factual Detail', 'Second Impact', 'Significance']
        };
      }

      // 15. Causal Explanation (12 marks)
      if (qText.includes('explain why') || qText.includes('12 marks') || task.marks === 12 || typeStr.includes('caus') || typeStr.includes('12')) {
        let checklist = [
          { letter: 'P1', name: 'Point 1 (First Factor)', desc: 'State and explain your first major causal factor.' },
          { letter: 'P2', name: 'Point 2 (Second Factor)', desc: 'State and explain a second distinct causal factor.' },
          { letter: 'P3', name: 'Point 3 (Own Knowledge)', desc: 'Introduce and analyze an additional factor from beyond the stimulus.' },
          { letter: 'L', name: 'Causal Links', desc: 'Link all factors together to show why they resulted in the outcome.' }
        ];
        if (Array.isArray(task.stimulus) && task.stimulus.length >= 2 && tracker.length >= 3) {
          checklist = [
            { letter: 'S1', name: 'Stimulus Factor 1', desc: \`Explain the causal impact of: \${task.stimulus[0]}.\` },
            { letter: 'S2', name: 'Stimulus Factor 2', desc: \`Explain the causal impact of: \${task.stimulus[1]}.\` },
            { letter: 'OK', name: 'Own Knowledge Factor', desc: 'Introduce a third crucial factor from beyond the stimulus prompts.' },
            { letter: 'X', name: 'Sustained Analysis', desc: 'Explain the relative importance and interaction between factors.' }
          ];
        }

        const causalTopic = cleanCausalTopic(task, lesson);
        const tariffLabel = isKs3 
          ? \`Key Stage 3 (\${unit.yearGroup || 'Year 7'}) &bull; Disciplinary Causal Analysis [12 marks]\`
          : (task.tariff ? \`\${task.tariff} &bull; Edexcel GCSE Causal Explanation\` : 'Edexcel GCSE &bull; 12-Mark Causal Explanation');

        return {
          type: 'causal_12m',
          tariffDesc: tariffLabel,
          starter: \`A decisive factor explaining \${causalTopic} was...\`,
          bronzeInstruction: 'Complete this sentence by stating your primary causal factor.',
          defaultChecklist: checklist,
          goldPrompt: task.gold_challenge || task.examiner_tip || "Examiner Tip: To reach Level 4, you must go beyond describing events. Explain HOW and WHY the factors worked together to produce the historical outcome.",
          goldInstruction: "Use high-level connectives like Consequently, Crucially, and This proved decisive because...",
          placeholder: \`Draft your analytical explanation here deploying your causal connectives and evidence...\`,
          spacingBadge: '(Secondary 7.5mm Ruled Lines • 3-Factor Causal Analysis)',
          trackerTerms: tracker.length > 0 ? tracker : ['Causal Factor 1', 'Causal Factor 2', 'Own Knowledge']
        };
      }

      // Fallback general secondary
      const fallbackTopic = cleanCausalTopic(task, lesson);
      return {
        type: 'general_secondary',
        tariffDesc: task.tariff || (isKs3 ? \`Key Stage 3 (\${unit.yearGroup || 'Year 7'}) &bull; Disciplinary Write-Up [12 marks]\` : '12-Mark Disciplinary Analysis'),
        starter: \`A decisive factor explaining \${fallbackTopic} was...\`,
        bronzeInstruction: 'Complete this sentence by stating your primary causal factor.',
        defaultChecklist: [
          { letter: 'P', name: 'Point', desc: 'State your main historical claim clearly.' },
          { letter: 'E', name: 'Evidence', desc: 'Support with precise historical facts.' },
          { letter: 'X', name: 'Explanation', desc: 'Explain how this evidence substantiates your claim.' }
        ],
        goldPrompt: task.gold_challenge || task.examiner_tip || "Deploy precise historical vocabulary to substantiate your criteria-led judgement.",
        goldInstruction: "Use high-level connectives like Consequently, Crucially, and This proved decisive because...",
        placeholder: \`Draft your analytical paragraph here deploying your causal connectives and evidence...\`,
        spacingBadge: '(Secondary 7.5mm Ruled Lines)',
        trackerTerms: tracker.length > 0 ? tracker : ['Historical Claim', 'Factual Evidence', 'Explanation']
      };
    }

    function renderWritingStudio(unit, lesson) {
      const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
      const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.keyStage || '').toLowerCase().includes('ks3') || /year\\s*[789]\\b/i.test(unit.year_group || unit.yearGroup || ''));

      // Determine full task list across all schema variants
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
        } else if (lesson.gcse_task?.tasks && Array.isArray(lesson.gcse_task.tasks) && lesson.gcse_task.tasks.length > 0) {
          currentWritingStudioTasks = lesson.gcse_task.tasks;
        } else if (Array.isArray(lesson.tasks) && lesson.tasks.length > 0) {
          currentWritingStudioTasks = lesson.tasks;
        } else if (Array.isArray(lesson.writing_tasks) && lesson.writing_tasks.length > 0) {
          currentWritingStudioTasks = lesson.writing_tasks;
        } else if (lesson.extended_writing) {
          currentWritingStudioTasks = [lesson.extended_writing];
        } else if (lesson.extended) {
          currentWritingStudioTasks = [lesson.extended];
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
            const label = getTaskStudioLabel(t, idx, isKs2, isKs3);
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

      // Setup initial task
      switchWritingStudioTask(0, unit, lesson, false);

      // Populate Vocabulary Palette
      // Connectives
      const connectives = [
        'Consequently', 'Catalyzed', 'Decisively', 'Undermined', 'Crucially', 'Inherently'
      ];
      document.getElementById('palette-chips-connectives').innerHTML = connectives.map(c => ` +
        "`<span class=\"palette-chip\" onclick=\"showWordHelp('${c}', 'A causal connective used to link historical events and demonstrate direct impact.')\">${c}</span>`" +
      `).join('');

      // Concepts / Key Terms from lesson
      const concepts = (lesson.vocab || lesson.vocabulary || []).map(v => typeof v === 'string' ? v : (v.term || v.name));
      const activeTask = currentWritingStudioTasks[0] || {};
      const activeTaskTerms = Array.isArray(activeTask.key_terms) ? activeTask.key_terms : [];
      const allConcepts = Array.from(new Set([...activeTaskTerms, ...concepts]));

      document.getElementById('palette-chips-concepts').innerHTML = allConcepts.slice(0, 8).map(v => {
        const term = typeof v === 'string' ? v : (v.term || v.name);
        const def = resolveConceptDefinition(v, lesson, stagesData);
        return `<span class="palette-chip" onclick="showWordHelp('${term.replace(/'/g, "\\\\'")}', '${def.replace(/'/g, "\\\\'")}')">${term}</span>`;
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
        document.getElementById('palette-chips-adjectives').innerHTML = ks2Adjectives.map(a => `
          <span class="palette-chip" onclick="showWordHelp('\${a.term}', '\${a.def.replace(/'/g, "\\\\'")}')">\${a.term}</span>
        \`).join('');
      } else {
        const adjectives = [
          { term: 'Decisive', def: 'Settling an issue convincingly or producing a definitive result.' },
          { term: 'Catastrophic', def: 'Involving or causing sudden, great damage or suffering.' },
          { term: 'Irrevocable', def: 'Not able to be changed, reversed, or recovered.' },
          { term: 'Formidable', def: 'Inspiring fear or respect through being impressively large or powerful.' }
        ];
        document.getElementById('palette-chips-adjectives').innerHTML = adjectives.map(a => `
          <span class="palette-chip" onclick="showWordHelp('\${a.term}', '\${a.def}')">\${a.term}</span>
        \`).join('');
      }

      // Setup write-up pad listener
      setupWriteupPadListener();
    }

    function switchWritingStudioTask(taskIdx, unit, lesson, saveOldDraft = true) {
      const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
      const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.keyStage || '').toLowerCase().includes('ks3') || /year\\s*[789]\\b/i.test(unit.year_group || unit.yearGroup || ''));

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
        } else if (isKs3) {
          activeBadge.innerHTML = \`Key Stage 3 Enquiry &bull; \${getTaskStudioLabel(task, taskIdx, false, true)}\`;
        } else {
          activeBadge.innerHTML = \`Edexcel GCSE &bull; \${getTaskStudioLabel(task, taskIdx, false, false)}\`;
        }
      }

      // Title & Subtitle/Tariff
      const titleEl = document.getElementById('writing-studio-title');
      const tariffEl = document.getElementById('writing-studio-tariff');
      if (isKs2) {
        titleEl.textContent = task.question || task.prompt || task.text || task.title || \`Historian Write-Up: \${lesson.title}\`;
        const taskTopic = task.topic ? \`\${task.topic} • \` : \`Task \${taskIdx + 1} • \`;
        tariffEl.textContent = \`Pupil Workbook Page \${workbookPage} Companion • \${taskTopic}Years 5–6 Enquiry\`;
      } else {
        titleEl.textContent = task.question || task.prompt || task.text || task.title || \`Extended Writing: \${lesson.title}\`;
        tariffEl.innerHTML = typeInfo.tariffDesc || task.tariff || (isKs3 ? \`Pupil Workbook Page \${workbookPage} &bull; Key Stage 3 Disciplinary Write-Up\` : '12-Mark Disciplinary Analysis');
      }

      // Bronze Starter
      let starter = task.starter || task.sentence_starter || scaffolding.sentence_starters?.[0] || scaffolding.steps?.[0]?.starter;
      if (!starter) {
        if (isKs2) {
          starter = \`During the Second World War, ordinary British people kept the country running because...\`;
        } else {
          starter = typeInfo.starter || \`A decisive factor explaining \${cleanCausalTopic(task, lesson)} was...\`;
        }
      }
      document.getElementById('bronze-sentence-starter').textContent = starter.startsWith('"') ? starter : \`"\${starter}"\`;

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

      // Gold Explanation: context-appropriate, never Hastings fallback
      let goldPrompt = task.gold_challenge || task.examiner_tip || typeInfo.goldPrompt;
      if (!goldPrompt) {
        if (isKs2) {
          goldPrompt = 'Historian Challenge: Link your facts together using powerful connectives like "As a result" or "Because of this" to show cause and effect.';
        } else {
          goldPrompt = 'Historian Challenge: Deploy precise historical vocabulary to substantiate your criteria-led analytical judgement.';
        }
      }
      document.getElementById('gold-explanation-sample').textContent = goldPrompt.startsWith('"') ? goldPrompt : \`"\${goldPrompt}"\`;

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
      const rawModel = task.model_answer || task.model || (task.model_tiers?.tier_12m?.text || task.model_tiers?.tier_2m?.text) || stagesData.map(s => s.modelSentence).join(' ');
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
          // Check key parts for multi-word phrases
          const words = cleanT.split(/\\s+/);
          if (words.length >= 2) {
            if (words[0].length > 3 && words[1].length > 3 && text.includes(words[0]) && text.includes(words[1])) {
              isIncluded = true;
            }
          }
          if (cleanT.includes('interpretation 1')) {
            isIncluded = text.includes('interpretation 1') || text.includes('int 1') || text.includes('first interpretation');
          } else if (cleanT.includes('interpretation 2')) {
            isIncluded = text.includes('interpretation 2') || text.includes('int 2') || text.includes('second interpretation');
          } else if (cleanT.includes('contextual knowledge') || cleanT.includes('own knowledge')) {
            isIncluded = text.includes('knowledge') || text.includes('context') || text.includes('for example') || text.includes('furthermore');
          } else if (cleanT.includes('final judgement') || cleanT.includes('sustained judgement')) {
            isIncluded = text.includes('conclusion') || text.includes('judgement') || text.includes('agree') || text.includes('disagree') || text.includes('on balance');
          } else if (cleanT.includes('main difference') || cleanT.includes('difference in views')) {
            isIncluded = text.includes('differ') || text.includes('difference') || text.includes('contrast') || text.includes('whereas') || text.includes('by contrast');
          } else if (cleanT.includes('reason for difference')) {
            isIncluded = text.includes('reason') || text.includes('focus') || text.includes('emphas') || text.includes('because');
          } else if (cleanT.includes('detail to follow up')) {
            isIncluded = text.includes('detail') || text.includes('source') || text.includes('follow up') || text.includes('"') || text.includes('quote');
          } else if (cleanT.includes('historical question')) {
            isIncluded = text.includes('question') || text.includes('?') || text.includes('ask') || text.includes('how') || text.includes('why');
          } else if (cleanT.includes('specific source type')) {
            isIncluded = text.includes('record') || text.includes('diar') || text.includes('register') || text.includes('report') || text.includes('log');
          } else if (cleanT.includes('historical value') || cleanT.includes('how it helps')) {
            isIncluded = text.includes('help') || text.includes('understand') || text.includes('reveal') || text.includes('show') || text.includes('value');
          } else if (cleanT.includes('first inference') || cleanT.includes('inference 1')) {
            isIncluded = text.includes('infer') || text.includes('deduce') || text.includes('(i)');
          } else if (cleanT.includes('quote 1') || cleanT.includes('supporting quote') || cleanT.includes('source quote 1')) {
            isIncluded = text.includes('details in the source') || text.includes('tell me this') || text.includes('"') || text.includes('quote');
          } else if (cleanT.includes('second inference') || cleanT.includes('inference 2')) {
            isIncluded = text.includes('(ii)') || text.includes('second') || (text.split('infer').length > 2);
          } else if (cleanT.includes('quote 2') || cleanT.includes('source quote 2')) {
            isIncluded = (text.split('"').length > 4) || (text.split('details in the source').length > 2);
          } else if (cleanT.includes('feature 1')) {
            isIncluded = text.includes('one') || text.includes('feature') || text.includes('(i)');
          } else if (cleanT.includes('feature 2') || cleanT.includes('second feature')) {
            isIncluded = text.includes('second') || text.includes('another') || text.includes('(ii)');
          } else if (cleanT.includes('key feature')) {
            isIncluded = text.includes('feature') || text.includes('was that') || text.includes('consisted');
          } else if (cleanT.includes('supporting detail') || cleanT.includes('detail 1') || cleanT.includes('detail 2')) {
            isIncluded = text.includes('for example') || text.includes('specifically') || text.includes('such as') || text.includes('in 1558');
          } else if (cleanT.includes('statute of labourers')) {
            isIncluded = text.includes('statute') || text.includes('labourers') || text.includes('1351');
          } else if (cleanT.includes('demographic collapse')) {
            isIncluded = text.includes('demographic') || text.includes('collapse') || text.includes('mortality') || text.includes('death');
          } else if (cleanT.includes('peasants revolt')) {
            isIncluded = text.includes('peasant') || text.includes('revolt') || text.includes('1381') || text.includes('tyler');
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
    }`;

fs.writeFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), snippet, 'utf8');
console.log('✅ Updated scripts/viewer_replacement_snippet.js');

