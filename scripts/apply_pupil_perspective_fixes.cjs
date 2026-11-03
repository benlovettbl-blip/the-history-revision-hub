const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');

const USA_FIXES = [
  {
    file: 'usa_mock_1.html',
    oldQ1: 'Give two things you can infer from Source A about Civil rights organisations in the early 1950s.',
    newQ1: 'Give two things you can infer from Source A about obstacles to voter registration for African Americans in the Southern states in the 1950s.'
  },
  {
    file: 'usa_mock_2.html',
    oldQ1: 'Give two things you can infer from Source A about Achievements of the civil rights movement in the years 1964–65.',
    newQ1: 'Give two things you can infer from Source A about the situation at Central High School, Little Rock, in September 1957.'
  },
  {
    file: 'usa_mock_3.html',
    oldQ1: 'Give two things you can infer from Source A about The March on Washington (1963).',
    newQ1: 'Give two things you can infer from Source A about the March on Washington (1963).',
    extraFix: (content) => {
      // Fix Section B enquiry topic in Mock 3: Sources B & C are Operation Rolling Thunder and Vietnam soldier morale!
      return content.replace(
        /enquiry into:\s*The March on Washington \(1963\)/gi,
        'enquiry into: US military tactics and soldier morale during the Vietnam War'
      ).replace(
        /enquiry into The March on Washington \(1963\)\?/gi,
        'enquiry into US military tactics and soldier morale during the Vietnam War?'
      );
    }
  },
  {
    file: 'usa_mock_4.html',
    oldQ1: 'Give two things you can infer from Source A about The methods of the Black Panther Party.',
    newQ1: 'Give two things you can infer from Source A about the dangers faced by US soldiers during search-and-destroy operations in Vietnam.'
  },
  {
    file: 'usa_mock_5.html',
    oldQ1: 'Give two things you can infer from Source A about The Freedom Summer (1964).',
    newQ1: 'Give two things you can infer from Source A about the Strategic Hamlet Program in South Vietnam in 1962.'
  },
  {
    file: 'usa_mock_6.html',
    oldQ1: 'Give two things you can infer from Source A about Achievements of Martin Luther King in the civil rights movement.',
    newQ1: 'Give two things you can infer from Source A about segregation and discrimination faced by Black Americans in the Deep South during the 1950s.'
  },
  {
    file: 'usa_mock_7.html',
    oldQ1: 'Give two things you can infer from Source A about Escalation of US involvement in the conflict in Vietnam in the 1960s.',
    newQ1: 'Give two things you can infer from Source A about communist supply lines along the Ho Chi Minh Trail in 1965.'
  },
  {
    file: 'usa_mock_8.html',
    oldQ1: 'Give two things you can infer from Source A about The effectiveness of US search and destroy tactics versus Vietcong guerrilla tactics.',
    newQ1: 'Give two things you can infer from Source A about the difficulties faced by US soldiers during search-and-destroy missions in Vietnam.'
  },
  {
    file: 'usa_mock_9.html',
    oldQ1: 'Give two things you can infer from Source A about The significance of the Birmingham Campaign (1963).',
    newQ1: 'Give two things you can infer from Source A about the response of the police to civil rights demonstrators in Birmingham in May 1963.'
  },
  {
    file: 'usa_mock_10.html',
    oldQ1: 'Give two things you can infer from Source A about The impact of peaceful protests and the role of presidents in passing civil rights legislation.',
    newQ1: 'Give two things you can infer from Source A about the dangers faced by civil rights volunteers during the Freedom Summer in Mississippi in 1964.'
  },
  {
    file: 'usa_mock_11.html',
    oldQ1: 'Give two things you can infer from Source A about the Little Rock High School crisis (1957).',
    newQ1: 'Give two things you can infer from Source A about the crowd outside Central High School, Little Rock, in September 1957.'
  },
  {
    file: 'usa_mock_12.html',
    oldQ1: 'Give two things you can infer from Source A about the opposition to the civil rights movement in the late 1950s.',
    newQ1: 'Give two things you can infer from Source A about the methods used by White Citizens\' Councils to oppose civil rights in the 1950s.'
  },
  {
    file: 'usa_mock_13.html',
    oldQ1: 'Give two things you can infer from Source A about the limitations of civil rights progress in the years 1968–75.',
    newQ1: 'Give two things you can infer from Source A about racial divisions and inequalities in American cities in 1968.'
  }
];

console.log('🔧 Applying Pupil Perspective alignment fixes to USA Mocks...');

USA_FIXES.forEach(({ file, oldQ1, newQ1, extraFix }) => {
  const filePath = path.join(BASE_DIR, 'data', 'raw_mocks', 'usa', file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: ${file} not found!`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Q1 prompt (case-insensitive and handling potential punctuation differences)
  const escapedOld = oldQ1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  const reg = new RegExp(escapedOld, 'gi');
  if (reg.test(content)) {
    content = content.replace(reg, newQ1);
    console.log(`  ✅ Fixed Q1 in ${file}`);
  } else {
    // Try broader search
    const broadReg = /Give two things you can infer from Source A about [^.<(]+/i;
    const match = content.match(broadReg);
    if (match) {
      console.log(`  🔄 Broad match in ${file}: "${match[0]}" -> Replacing with new Q1`);
      content = content.replace(broadReg, newQ1.replace(/\.$/, ''));
    } else {
      console.warn(`  ❌ Could not match Q1 in ${file}`);
    }
  }

  if (extraFix) {
    content = extraFix(content);
    console.log(`  ✨ Applied extra fix in ${file}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('\n🔧 Applying Pupil Perspective alignment fixes to Medicine Mock C...');
const medCPath = path.join(BASE_DIR, 'data', 'raw_mocks', 'edexcel_medicine', 'mock_c_2026_predict.html');
if (fs.existsSync(medCPath)) {
  let medContent = fs.readFileSync(medCPath, 'utf8');
  
  // Align Q2a enquiry to include evacuation and frontline care
  medContent = medContent.replace(
    /enquiry into the development of techniques for blood transfusion and blood storage on the Western Front/gi,
    'enquiry into the treatment and evacuation of casualties near the frontline on the Western Front'
  );

  // Align Q2b follow-up question to Source B (stretcher bearers at Passchendaele)
  medContent = medContent.replace(
    /to find out more about the techniques for frontline blood storage\?/gi,
    'to find out more about the challenges of casualty evacuation near the frontline?'
  );

  fs.writeFileSync(medCPath, medContent, 'utf8');
  console.log('  ✅ Fixed Q2(a) and Q2(b) in Medicine Mock C');
}

console.log('\n🎉 All raw mock templates successfully updated!');

