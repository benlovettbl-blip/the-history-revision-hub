const q = 'How far do you agree with Interpretation 2 about the position of women in the Weimar Republic? Explain your answer, using both interpretations and your knowledge of the historical context.';

function extractStatementFocus(question, fallback = 'this view') {
  if (!question) return fallback;
  const match = question.match(/['"‘“](.*?)['"’”]/);
  if (match && match[1].trim().length > 10) {
    let stmt = match[1].trim().replace(/\.+$/, '').trim();
    return stmt;
  }
  const agreeMatch = question.match(/^(.*?)(?:,\s*)?(?:how far do you agree|\?|\[)/i);
  if (agreeMatch && agreeMatch[1].trim().length > 15) {
    return agreeMatch[1].trim().replace(/\.+$/, '');
  }
  return fallback;
}

console.log('Result:', extractStatementFocus(q));

