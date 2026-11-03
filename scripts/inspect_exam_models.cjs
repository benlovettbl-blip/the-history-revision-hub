async function inspectExamPractice() {
  const mod = (await import('file:///C:/Projects/the-history-revision-hub/units/edexcel_medicine/data.js')).default;
  console.log(`Inspecting ${mod.lessons.length} lessons in edexcel_medicine...`);

  let totalQuestions = 0;
  const questionsByType = {};

  mod.lessons.forEach((l, idx) => {
    const ep = l.exam_practice || l.exam_tasks || [];
    const questions = [];
    if (Array.isArray(ep)) {
      ep.forEach(item => {
        if (item.questions) questions.push(...item.questions);
        else questions.push(item);
      });
    } else if (ep.questions) {
      questions.push(...ep.questions);
    }

    console.log(`Lesson ${idx + 1} (${l.id}) - ${questions.length} exam question(s):`);
    questions.forEach((q, qIdx) => {
      totalQuestions++;
      const t = q.type || q.tariff || 'unknown';
      questionsByType[t] = (questionsByType[t] || 0) + 1;
      const modelLength = (q.model || q.model_answer || '').length;
      const words = (q.model || q.model_answer || '').split(/\s+/).filter(Boolean).length;
      console.log(`  Q[${qIdx+1}] [${q.tariff || q.type}] "${(q.question || '').slice(0, 60)}..." -> Model: ${words} words (${modelLength} chars)`);
    });
  });

  console.log('\nTotal Questions:', totalQuestions);
  console.log('Types:', questionsByType);
}

inspectExamPractice().catch(console.error);

