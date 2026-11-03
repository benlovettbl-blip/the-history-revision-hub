const d = require('C:/Projects/the-history-revision-hub/units/cme_new/data.js').default;

d.lessons.forEach((l, idx) => {
  console.log('Lesson ' + (idx + 1) + ' (' + l.id + '):');
  console.log('   hasEnquiry: ' + !!l.enquiry + (l.enquiry ? ' -> ' + l.enquiry : ''));
  console.log('   hasHookText: ' + !!l.hook_text + (l.hook_text ? ' -> ' + l.hook_text.substring(0, 80) + '...' : ''));
});

