/**
 * British Historical Spoken Date Normalizer (`spoken_date_normalizer.mjs`)
 *
 * Converts printed academic dates (`On 1 July 1916`, `3 September 1939`, `9–10 November 1938`,
 * `between 5 and 8 June 1967`) into natural spoken British ordinal dates
 * (`On the first of July 1916`, `the third of September 1939`, `the ninth and tenth of November 1938`)
 * strictly inside the TTS speech layer — leaving printed curriculum prose 100% untouched.
 */

const ORDINAL_WORDS = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
  11: 'eleventh',
  12: 'twelfth',
  13: 'thirteenth',
  14: 'fourteenth',
  15: 'fifteenth',
  16: 'sixteenth',
  17: 'seventeenth',
  18: 'eighteenth',
  19: 'nineteenth',
  20: 'twentieth',
  21: 'twenty-first',
  22: 'twenty-second',
  23: 'twenty-third',
  24: 'twenty-fourth',
  25: 'twenty-fifth',
  26: 'twenty-sixth',
  27: 'twenty-seventh',
  28: 'twenty-eighth',
  29: 'twenty-ninth',
  30: 'thirtieth',
  31: 'thirty-first',
};

const MONTH_MAP = {
  January: 'January',
  February: 'February',
  March: 'March',
  April: 'April',
  May: 'May',
  June: 'June',
  July: 'July',
  August: 'August',
  September: 'September',
  October: 'October',
  November: 'November',
  December: 'December',
  Jan: 'January',
  'Jan.': 'January',
  Feb: 'February',
  'Feb.': 'February',
  Mar: 'March',
  'Mar.': 'March',
  Apr: 'April',
  'Apr.': 'April',
  Jun: 'June',
  'Jun.': 'June',
  Jul: 'July',
  'Jul.': 'July',
  Aug: 'August',
  'Aug.': 'August',
  Sep: 'September',
  'Sep.': 'September',
  Sept: 'September',
  'Sept.': 'September',
  Oct: 'October',
  'Oct.': 'October',
  Nov: 'November',
  'Nov.': 'November',
  Dec: 'December',
  'Dec.': 'December',
};

const MONTH_PATTERN =
  '(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan\\.?|Feb\\.?|Mar\\.?|Apr\\.?|Jun\\.?|Jul\\.?|Aug\\.?|Sept\\.?|Sep\\.?|Oct\\.?|Nov\\.?|Dec\\.?)';

function shouldOmitLeadingArticle(prefix) {
  // Already preceded by "the " (e.g. "the 10 June ceasefire", "the 9 April 1948 Deir Yassin")
  if (/\bthe\s+$/i.test(prefix)) return true;
  // Preceded by "a " or "a <adj> " (e.g. "a 1 June 1586 ambush", "a pre-emptive 1 June 1586 ambush")
  if (/\b(?:a|an)\s+(?:[A-Za-z-]+\s+)?$/i.test(prefix)) return true;
  return false;
}

function shouldCapitalizeArticle(prefix) {
  const trimmed = prefix.replace(/(?:<short pause>\s*)+$/i, '');
  return trimmed.length === 0 || /[.!?]\s+$/.test(trimmed);
}

export function expandBritishDatesForSpeech(input) {
  let s = String(input || '');
  if (!s) return s;

  // 1. "between <D1> and <D2> <Month>" -> "between the fifth and the eighth of June"
  const betweenRe = new RegExp(
    `\\b(between\\s+)([12]?\\d|3[01])(?:st|nd|rd|th)?(\\s+and\\s+)([12]?\\d|3[01])(?:st|nd|rd|th)?\\s+(${MONTH_PATTERN})(?=\\b|\\s|$|[.,;:!?)])`,
    'g',
  );
  s = s.replace(betweenRe, (_, p1, d1, p2, d2, mRaw) => {
    const o1 = ORDINAL_WORDS[Number(d1)];
    const o2 = ORDINAL_WORDS[Number(d2)];
    const fullM = MONTH_MAP[mRaw] || mRaw;
    if (!o1 || !o2) return _;
    return `${p1}the ${o1}${p2}the ${o2} of ${fullM}`;
  });

  // 2. Date ranges "<D1>–<D2> <Month>" / "<D1>-<D2> <Month>" -> "(the) ninth and tenth of November"
  const rangeRe = new RegExp(
    `\\b([12]?\\d|3[01])(?:st|nd|rd|th)?\\s*[–-]\\s*([12]?\\d|3[01])(?:st|nd|rd|th)?\\s+(${MONTH_PATTERN})(?=\\b|\\s|$|[.,;:!?)])`,
    'g',
  );
  s = s.replace(rangeRe, (match, d1, d2, mRaw, offset, fullStr) => {
    const o1 = ORDINAL_WORDS[Number(d1)];
    const o2 = ORDINAL_WORDS[Number(d2)];
    const fullM = MONTH_MAP[mRaw] || mRaw;
    if (!o1 || !o2) return match;
    const prefix = fullStr.slice(Math.max(0, offset - 32), offset);
    if (shouldOmitLeadingArticle(prefix)) {
      return `${o1} and ${o2} of ${fullM}`;
    }
    const art = shouldCapitalizeArticle(prefix) ? 'The ' : 'the ';
    return `${art}${o1} and ${o2} of ${fullM}`;
  });

  // 3. Single dates "<D1>[st|nd|rd|th] <Month>" -> "(the) first of July"
  const singleRe = new RegExp(
    `\\b([12]?\\d|3[01])(?:st|nd|rd|th)?\\s+(${MONTH_PATTERN})(?=\\b|\\s|$|[.,;:!?)])`,
    'g',
  );
  s = s.replace(singleRe, (match, d1, mRaw, offset, fullStr) => {
    const o1 = ORDINAL_WORDS[Number(d1)];
    const fullM = MONTH_MAP[mRaw] || mRaw;
    if (!o1) return match;
    const prefix = fullStr.slice(Math.max(0, offset - 32), offset);
    if (shouldOmitLeadingArticle(prefix)) {
      return `${o1} of ${fullM}`;
    }
    const art = shouldCapitalizeArticle(prefix) ? 'The ' : 'the ';
    return `${art}${o1} of ${fullM}`;
  });

  return s;
}
