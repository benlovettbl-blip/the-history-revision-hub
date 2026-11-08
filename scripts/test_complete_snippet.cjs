const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Read the complete enhanced functions
const sandbox = {
  console: console,
  document: { getElementById: () => null }
};
vm.createContext(sandbox);

// Build code
const testCode = `
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

this.getTaskTypeInfo = getTaskTypeInfo;
this.getTaskStudioLabel = getTaskStudioLabel;
`;

vm.runInContext(testCode, sandbox);

const cases = [
  {
    name: 'Weimar L4 Q3(d) 16m Interpretation Essay',
    unit: { keyStage: 'KS4' },
    lesson: { title: 'KT1.4: Changes in Society, 1924–1929' },
    task: {
      marks: 16,
      tariff: '16 marks (+4 SPaG)',
      question: '3(d). How far do you agree with Interpretation 2 about the position of women in the Weimar Republic? Explain your answer, using both interpretations and your knowledge of the historical context.'
    }
  },
  {
    name: 'Great War L3 Q3(b) 4m Difference in Interpretations',
    unit: { keyStage: 'KS3', yearGroup: 'Year 9' },
    lesson: { title: 'The Anglo-German Naval Arms Race' },
    task: {
      marks: 4,
      tariff: '4 marks',
      question: 'Study Interpretations 1 and 2. How do they differ about the causes of the Anglo-German naval arms race? [4 marks]'
    }
  },
  {
    name: 'Great War L3 Q3(c) 4m Reason for Difference',
    unit: { keyStage: 'KS3', yearGroup: 'Year 9' },
    lesson: { title: 'The Anglo-German Naval Arms Race' },
    task: {
      marks: 4,
      tariff: '4 marks',
      question: 'Suggest one reason why Interpretations 1 and 2 differ about the causes of the naval arms race. [4 marks]'
    }
  },
  {
    name: 'Australia L4 Q3(b)&(c) 8m Contrasting Interpretations',
    unit: { keyStage: 'KS3', yearGroup: 'Year 8' },
    lesson: { title: 'The Frontier Wars' },
    task: {
      tariff: 'Question 3(b) & 3(c): Contrasting Interpretations [8 marks • 10 mins]',
      type: 'historical_interpretations',
      question: 'Explain how Interpretations 1 and 2 differ on the nature of the Australian Frontier Wars and suggest why they reach contrasting conclusions. [8 marks]'
    }
  },
  {
    name: 'Medicine L21 4m Source Follow-Up',
    unit: { keyStage: 'KS4' },
    lesson: { title: 'KT5.1: The British Sector of the Western Front' },
    task: {
      tariff: '4 marks',
      question: 'Study Source B. How could you follow up Source B to find out more about the difficulties stretcher bearers faced? [4 marks]'
    }
  },
  {
    name: 'Early Elizabethan England L1 Q1(a) 2m Key Feature',
    unit: { keyStage: 'KS4' },
    lesson: { title: 'KT 1.1: The Situation on Elizabeth’s Accession, 1558' },
    task: {
      tariff: 'Q1(a): Feature [2 marks]',
      type: 'written',
      text: 'Q1(a). Describe one key feature of the role of the Privy Council in 1558. [2 marks]'
    }
  },
  {
    name: 'Early Elizabethan England L2 Q3 16m Evaluative Essay',
    unit: { keyStage: 'KS4' },
    lesson: { title: "KT 1.2: The 'Settlement' of Religion, 1559" },
    task: {
      tariff: '16 marks',
      type: 'essay_16',
      question: '3. “The Religious Settlement was successful in resolving religious divisions in England in 1559.” How far do you agree? Explain your answer. [16 marks]'
    }
  }
];

cases.forEach(tc => {
  console.log(`\n======================================================`);
  console.log(`TEST: ${tc.name}`);
  const label = sandbox.getTaskStudioLabel(tc.task, 0, false, tc.unit.keyStage === 'KS3');
  const info = sandbox.getTaskTypeInfo(tc.task, tc.unit, tc.lesson);
  console.log(`Pill Label: "${label}"`);
  console.log(`Type: "${info.type}"`);
  console.log(`Tariff: "${info.tariffDesc}"`);
  console.log(`Starter: "${info.starter}"`);
  console.log(`Pills:`, info.trackerTerms);
  console.log(`Checklist:`, info.defaultChecklist?.map(c => `${c.letter}: ${c.name}`));
});
