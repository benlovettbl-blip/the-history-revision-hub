const fs = require('fs');

const units = ['edexcel_medicine', 'weimar_nazi_germany', 'cold_war', 'eee', 'usa'];
units.forEach(u => {
  const p = 'C:/Projects/the-history-revision-hub/units/' + u + '/data.js';
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, 'utf8').replace(/^export\s+default\s+/, '').replace(/;\s*$/, '');
    try {
      const d = JSON.parse(raw);
      const l1 = d.lessons[0];
      console.log('=== ' + u + ' (lessons: ' + d.lessons.length + ') ===');
      console.log('   l1.hook_text: ' + (l1.hook_text ? l1.hook_text.substring(0, 70) + '...' : 'NONE'));
      console.log('   l1.enquiry: ' + (l1.enquiry ? l1.enquiry.substring(0, 70) + '...' : 'NONE'));
      console.log('   l1.enquiry_question: ' + (l1.enquiry_question ? l1.enquiry_question.substring(0, 70) + '...' : 'NONE'));

      // Check across all lessons in this unit
      let withHook = 0, withEnquiry = 0;
      d.lessons.forEach(l => {
        if (l.hook_text) withHook++;
        if (l.enquiry) withEnquiry++;
      });
      console.log('   Stats: withHook=' + withHook + ', withEnquiry=' + withEnquiry);
    } catch(e) {
      console.log(u + ' parse error: ' + e.message);
    }
  }
});

