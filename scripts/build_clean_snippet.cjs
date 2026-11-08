const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.resolve(__dirname, 'test_complete_snippet.cjs'), 'utf8');
const startIdx = src.indexOf('function cleanCausalTopic');
const endIdx = src.indexOf('this.getTaskTypeInfo');

const coreFunctions = src.slice(startIdx, endIdx).trim();

// Now add renderWritingStudio, switchWritingStudioTask, and renderWriteupTrackerPills
const tailFunctions = `
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
            return '<button type="button" class="ks2-task-nav-btn" data-task-idx="' + idx + '" style="padding: 5px 12px; font-size: 0.74rem; font-weight: 700; border-radius: 5px; cursor: pointer; transition: all 0.15s ease; border: 1.2px solid #334155; background: #1e293b; color: #cbd5e1; display: inline-flex; align-items: center; gap: 5px;">' + label + '</button>';
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
      const connectives = [
        'Consequently', 'Catalyzed', 'Decisively', 'Undermined', 'Crucially', 'Inherently'
      ];
      document.getElementById('palette-chips-connectives').innerHTML = connectives.map(c => {
        return '<span class="palette-chip" onclick="showWordHelp(\\'' + c + '\\', \\'A causal connective used to link historical events and demonstrate direct impact.\\')">' + c + '</span>';
      }).join('');

      // Concepts / Key Terms from lesson
      const concepts = (lesson.vocab || lesson.vocabulary || []).map(v => typeof v === 'string' ? v : (v.term || v.name));
      const activeTask = currentWritingStudioTasks[0] || {};
      const activeTaskTerms = Array.isArray(activeTask.key_terms) ? activeTask.key_terms : [];
      const allConcepts = Array.from(new Set([...activeTaskTerms, ...concepts]));

      document.getElementById('palette-chips-concepts').innerHTML = allConcepts.slice(0, 8).map(v => {
        const term = typeof v === 'string' ? v : (v.term || v.name);
        const def = resolveConceptDefinition(v, lesson, stagesData);
        return '<span class="palette-chip" onclick="showWordHelp(\\'' + term.replace(/'/g, "\\\\'") + '\\', \\'' + def.replace(/'/g, "\\\\'") + '\\')">' + term + '</span>';
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
        document.getElementById('palette-chips-adjectives').innerHTML = ks2Adjectives.map(a => {
          return '<span class="palette-chip" onclick="showWordHelp(\\'' + a.term + '\\', \\'' + a.def.replace(/'/g, "\\\\'") + '\\')">' + a.term + '</span>';
        }).join('');
      } else {
        const adjectives = [
          { term: 'Decisive', def: 'Settling an issue convincingly or producing a definitive result.' },
          { term: 'Catastrophic', def: 'Involving or causing sudden, great damage or suffering.' },
          { term: 'Irrevocable', def: 'Not able to be changed, reversed, or recovered.' },
          { term: 'Formidable', def: 'Inspiring fear or respect through being impressively large or powerful.' }
        ];
        document.getElementById('palette-chips-adjectives').innerHTML = adjectives.map(a => {
          return '<span class="palette-chip" onclick="showWordHelp(\\'' + a.term + '\\', \\'' + a.def + '\\')">' + a.term + '</span>';
        }).join('');
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
          activeBadge.innerHTML = 'Page ' + workbookPage + ' &bull; Task ' + (taskIdx + 1) + ' of ' + currentWritingStudioTasks.length;
        } else if (isKs3) {
          activeBadge.innerHTML = 'Key Stage 3 Enquiry &bull; ' + getTaskStudioLabel(task, taskIdx, false, true);
        } else {
          activeBadge.innerHTML = 'Edexcel GCSE &bull; ' + getTaskStudioLabel(task, taskIdx, false, false);
        }
      }

      // Title & Subtitle/Tariff
      const titleEl = document.getElementById('writing-studio-title');
      const tariffEl = document.getElementById('writing-studio-tariff');
      if (isKs2) {
        titleEl.textContent = task.question || task.prompt || task.text || task.title || ('Historian Write-Up: ' + lesson.title);
        const taskTopic = task.topic ? (task.topic + ' • ') : ('Task ' + (taskIdx + 1) + ' • ');
        tariffEl.textContent = 'Pupil Workbook Page ' + workbookPage + ' Companion • ' + taskTopic + 'Years 5–6 Enquiry';
      } else {
        titleEl.textContent = task.question || task.prompt || task.text || task.title || ('Extended Writing: ' + lesson.title);
        tariffEl.innerHTML = typeInfo.tariffDesc || task.tariff || (isKs3 ? ('Pupil Workbook Page ' + workbookPage + ' &bull; Key Stage 3 Disciplinary Write-Up') : '12-Mark Disciplinary Analysis');
      }

      // Bronze Starter
      let starter = task.starter || task.sentence_starter || scaffolding.sentence_starters?.[0] || scaffolding.steps?.[0]?.starter;
      if (!starter) {
        if (isKs2) {
          starter = 'During the Second World War, ordinary British people kept the country running because...';
        } else {
          starter = typeInfo.starter || ('A decisive factor explaining ' + cleanCausalTopic(task, lesson) + ' was...');
        }
      }
      document.getElementById('bronze-sentence-starter').textContent = starter.startsWith('"') ? starter : ('"' + starter + '"');

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
        checklistContainer.innerHTML = task.hints.map(h => '<li style="margin-bottom: 6px; line-height: 1.4;">' + h + '</li>').join('');
      } else if (Array.isArray(scaffolding.steps) && scaffolding.steps.length > 0) {
        checklistContainer.innerHTML = scaffolding.steps.map(step => {
          const badge = step.letter ? '<span style="display:inline-block; padding: 1px 6px; border-radius: 3px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-weight: 800; font-size: 0.72rem; margin-right: 6px;">' + step.letter + '</span>' : '';
          const name = step.name ? ('<strong>' + step.name + ':</strong> ') : '';
          const desc = step.prompt || step.desc || step.description || '';
          return '<li style="margin-bottom: 6px; line-height: 1.4;">' + badge + name + desc + '</li>';
        }).join('');
      } else if (Array.isArray(scaffolding.structure_strip) && scaffolding.structure_strip.length > 0) {
        checklistContainer.innerHTML = scaffolding.structure_strip.map(s => '<li style="margin-bottom: 6px; line-height: 1.4;">' + s + '</li>').join('');
      } else if (typeInfo && Array.isArray(typeInfo.defaultChecklist) && typeInfo.defaultChecklist.length > 0) {
        checklistContainer.innerHTML = typeInfo.defaultChecklist.map(step => {
          const badge = step.letter ? '<span style="display:inline-block; padding: 1px 6px; border-radius: 3px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-weight: 800; font-size: 0.72rem; margin-right: 6px;">' + step.letter + '</span>' : '';
          const name = step.name ? ('<strong>' + step.name + ':</strong> ') : '';
          const desc = step.desc || step.prompt || '';
          return '<li style="margin-bottom: 6px; line-height: 1.4;">' + badge + name + desc + '</li>';
        }).join('');
      } else if (stagesData.length >= 3) {
        const first = stagesData[0];
        const mid = stagesData[Math.floor(stagesData.length / 2)];
        const last = stagesData[stagesData.length - 1];

        if (isKs2) {
          checklistContainer.innerHTML = '<li>Mention what happened during: <strong>' + (first.words[0]?.term || first.title) + '</strong></li>' +
            '<li>Explain the role of: <strong>' + (mid.words[0]?.term || mid.title) + '</strong></li>' +
            '<li>Describe the impact of: <strong>' + (last.words[0]?.term || last.title) + '</strong></li>';
        } else {
          checklistContainer.innerHTML = '<li>Did you reference the initial crisis: <strong>' + (first.words[0]?.term || first.title) + '</strong>?</li>' +
            '<li>Did you explain the central turning point: <strong>' + (mid.words[0]?.term || mid.title) + '</strong>?</li>' +
            '<li>Did you analyze the final resolution: <strong>' + (last.words[0]?.term || last.title) + '</strong>?</li>';
        }
      }

      // Gold Explanation
      let goldPrompt = task.gold_challenge || task.examiner_tip || typeInfo.goldPrompt;
      if (!goldPrompt) {
        if (isKs2) {
          goldPrompt = 'Historian Challenge: Link your facts together using powerful connectives like "As a result" or "Because of this" to show cause and effect.';
        } else {
          goldPrompt = 'Historian Challenge: Deploy precise historical vocabulary to substantiate your criteria-led analytical judgement.';
        }
      }
      document.getElementById('gold-explanation-sample').textContent = goldPrompt.startsWith('"') ? goldPrompt : ('"' + goldPrompt + '"');

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
          textarea.placeholder = 'Write your historian answer for ' + (task.tag || 'this task') + ' here using your Bronze starter and facts...';
        } else {
          textarea.className = 'ruled-writing-area ks3-ruled';
          spacingBadge.textContent = typeInfo.spacingBadge || '(Secondary 7.5mm Ruled Lines)';
          textarea.placeholder = typeInfo.placeholder || 'Draft your analytical paragraph here deploying your causal connectives and evidence...';
        }
        textarea.value = userDraftsByTask[taskIdx] || '';
      }

      // Concepts / Key Vocabulary Bank
      const taskKeyTerms = Array.isArray(task.key_terms) ? task.key_terms : [];
      const lessonVocabs = (lesson.vocab || lesson.vocabulary || []).map(v => typeof v === 'string' ? v : (v.term || v.name));
      const combinedVocabs = Array.from(new Set([...taskKeyTerms, ...lessonVocabs]));

      const conceptsContainer = document.getElementById('palette-chips-concepts');
      if (conceptsContainer) {
        conceptsContainer.innerHTML = combinedVocabs.slice(0, 8).map(term => {
          const def = resolveConceptDefinition(term, lesson, stagesData);
          return '<span class="palette-chip" onclick="showWordHelp(\\'' + term.replace(/'/g, "\\\\'") + '\\', \\'' + def.replace(/'/g, "\\\\'") + '\\')">' + term + '</span>';
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
          ? '<i class="fa-solid fa-file-signature"></i> Exemplar Historian Paragraph (WAGOLL) &bull; Task ' + (taskIdx + 1)
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
          return '<span class="tracker-pill included"><i class="fa-solid fa-check"></i> ' + t + '</span>';
        } else {
          return '<span class="tracker-pill missing"><i class="fa-regular fa-circle"></i> ' + t + '</span>';
        }
      }).join('');

      const countEl = document.getElementById('writeup-word-count');
      if (countEl && textarea) {
        const words = textarea.value.trim().split(/\\s+/).filter(Boolean).length;
        countEl.textContent = 'Words: ' + words;
      }
    }
`;

const fullSnippet = `    let currentWritingStudioTaskIndex = 0;
    let currentWritingStudioTasks = [];
    const userDraftsByTask = {};

` + coreFunctions + '\n' + tailFunctions;

fs.writeFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), fullSnippet, 'utf8');
console.log('✅ Generated clean scripts/viewer_replacement_snippet.js');

