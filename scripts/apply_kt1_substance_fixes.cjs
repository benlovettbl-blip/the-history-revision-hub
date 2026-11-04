const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../units/usa/data.js');
let content = fs.readFileSync(dataPath, 'utf8');

const updates = [
  // 1. L1 [D] - Thurgood Marshall
  {
    targetTitle: "Source D: From an Address by Thurgood Marshall, Chief Legal Counsel for the NAACP, to the National Convention (July 1953)",
    newImage: "/units/usa/assets/sources/thurgood_marshall_naacp_counsel.jpg",
    caption: "NAACP Chief Legal Counsel Thurgood Marshall conferring during preparations for landmark school desegregation litigation (Library of Congress, c. 1953).",
    text: "We have taken the position that the Fourteenth Amendment was intended to eliminate all government-imposed distinctions based on race. There can be no such thing as 'separate but equal' in education or anywhere else in our national life. The state cannot use the color of a child's skin to deny that child the finest education the state can afford. We intend to fight this battle until every segregated school door in America is opened to all children regardless of race."
  },
  // 2. L2 [A] - Brown v. Board ruling
  {
    targetTitle: "Source A: From the Unanimous Supreme Court Opinion Delivered by Chief Justice Earl Warren in Brown v. Board of Education (17 May 1954)",
    newImage: "/units/usa/assets/sources/warren-court-1954.jpg",
    caption: "The nine Justices of the Warren Supreme Court who unanimously ruled in Brown v. Board of Education that racial segregation in public schools violates the Fourteenth Amendment (May 1954).",
    text: "Does segregation of children in public schools solely on the basis of race, even though the physical facilities and other 'tangible' factors may be equal, deprive the children of the minority group of equal educational opportunities? We believe that it does... To separate them from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone... We conclude that in the field of public education the doctrine of 'separate but equal' has no place. Separate educational facilities are inherently unequal."
  },
  // 3. L2 [B] - Southern Manifesto
  {
    targetTitle: "Source B: Declaration of Constitutional Principles (The Southern Manifesto) Signed by 101 Southern Congressmen (12 March 1956)",
    newImage: "/units/usa/assets/sources/southern_manifesto_congressional_record_1956.png",
    caption: "Congressional Record excerpt of the 'Declaration of Constitutional Principles' (The Southern Manifesto), signed by 101 Southern congressmen pledging resistance to school integration (12 March 1956).",
    text: "The unwarranted decision of the Supreme Court in the public school cases is now bearing the fruit always produced when men substitute naked power for established law... We regard this unwarranted exercise of power by the Court, contrary to the Constitution, as creating chaos and confusion in the States principally affected. It is destroying the amicable relations between the white and Negro races that have been created through 90 years of patient effort by the good people of both races... We pledge ourselves to use all lawful means to bring about a reversal of this decision which is contrary to the Constitution, and to prevent the use of force in its implementation."
  },
  // 4. L2 [C] - Orval Faubus
  {
    targetTitle: "Source C: Arkansas Governor Orval Faubus Televised Address Announcing the Deployment of the Arkansas National Guard (2 September 1957)",
    newImage: "/units/usa/assets/sources/orval_faubus_little_rock_1957.jpg",
    caption: "Arkansas Governor Orval Faubus speaking into news microphones outside the state capitol after deploying the National Guard to block nine Black students from entering Central High School (September 1957).",
    text: "Now, who is the real target? The public has been told that the issue is integration versus segregation. The real issue is the preservation of public peace and order... If mobile television crews, out-of-state agitators, and large crowds converge upon Central High School tomorrow morning, violence and disorder will result. Units of the National Guard have been deployed to preserve peace and order and to prevent unlawful assembly and violence."
  },
  // 5. L3 [B] - Jo Ann Robinson Boycott Leaflet
  {
    targetTitle: "Source B: Mimeographed Boycott Leaflet Authored by Jo Ann Robinson and the Women's Political Council (2 December 1955)",
    newImage: "/units/usa/assets/sources/portraits/jo_ann_robinson.jpg",
    caption: "Mugshot of Women's Political Council President Jo Ann Robinson following her arrest during the Montgomery Bus Boycott (Montgomery County Sheriff's Department, 1956).",
    text: "Another woman has been arrested and thrown into jail because she refused to get up out of her seat on the bus for a white person... This is the second time since the Claudette Colvin case that a Negro woman has been arrested for the same thing. This must be stopped. Negroes have rights, too, for if Negroes did not ride the buses, they could not operate... We are, therefore, asking every Negro to stay off the buses Monday in protest of the arrest and trial. Don't ride the buses to work, to town, to school, or anywhere on Monday."
  },
  // 6. L3 [E] - Browder v. Gayle
  {
    targetTitle: "Source E: From the Federal District Court Ruling in Browder v. Gayle Outlawing Bus Segregation (5 June 1956)",
    newImage: "/units/usa/assets/sources/rosa-parks-bus-1956.jpg",
    caption: "Rosa Parks seated in the front section of a Montgomery city bus on 21 December 1956, the first day public transport desegregation went into effect under federal court order.",
    text: "We hold that the statutes and ordinances requiring the segregation of the white and colored races on the motor buses of a common carrier of passengers in the City of Montgomery violate the due process and equal protection clauses of the Fourteenth Amendment to the Constitution of the United States. The doctrine of 'separate but equal' announced in Plessy v. Ferguson has been completely repudiated in the area of public transportation."
  },
  // 7. L4 [B] - Emmett Till
  {
    targetTitle: "Source B: Front-Page Report from the Chicago Defender on the Lynching of Emmett Till (10 September 1955)",
    newImage: "/units/usa/assets/sources/emmett_till_open_casket_mamie_1955.jpg",
    caption: "Mamie Till Bradley weeping beside the open glass-topped casket of her 14-year-old lynched son Emmett Till at Roberts Temple Church of God in Chicago (September 1955).",
    text: "TILL MURDER SHOCKS NATION: The mutilated, water-bloated body of 14-year-old Emmett Till was viewed by thousands of horror-stricken mourners this week at Roberts Temple Church of God. The boy's mother, Mrs. Mamie Bradley, insisted that the casket remain open so that the entire world could bear witness to the brutal horror of Mississippi lynch law: 'There was just no way I could describe to anyone what was in that box. I wanted the whole world to see what they did to my baby.'"
  },
  // 8. L4 [D] - Civil Rights Act 1957
  {
    targetTitle: "Source D: Excerpt from the Civil Rights Act of 1957 Passed by the United States Congress (9 September 1957)",
    newImage: "/units/usa/assets/sources/eisenhower-little-rock-speech.jpg",
    caption: "President Dwight D. Eisenhower addressing the nation from the Oval Office regarding federal civil rights authority and constitutional enforcement.",
    text: "Be it enacted by the Senate and House of Representatives of the United States of America in Congress assembled... There is hereby created in the executive branch of the Government a Commission on Civil Rights... The Commission shall investigate allegations that certain citizens of the United States are being deprived of their right to vote and have that vote counted by reason of their color, race, religion, or national origin. The Attorney General is authorized to institute a civil action for injunctive relief whenever any person has engaged in any act which would deprive any other person of such right."
  }
];

// We will parse the file as an object or perform targeted replacements
console.log('Loading usa/data.js...');
const objPrefix = 'export default ';
let jsonStr = content.replace(objPrefix, '').trim();
if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

const data = eval('(' + jsonStr + ')');
let updatedSourcesCount = 0;

function updateSourceObj(src, u) {
  src.image = u.newImage;
  src.image_url = u.newImage;
  src.src = u.newImage;
  src.source = u.newImage;
  src.caption = u.caption;
  src.text = u.text;
  updatedSourcesCount++;
}

data.lessons.forEach(l => {
  // Update in stages
  (l.stages || []).forEach(st => {
    (st.sources || []).forEach(src => {
      const u = updates.find(item => item.targetTitle === src.title);
      if (u) {
        updateSourceObj(src, u);
        console.log(`Updated stage source: ${src.title}`);
      }
    });
  });

  // Update in lesson root sources
  (l.sources || []).forEach(src => {
    const u = updates.find(item => item.targetTitle === src.title);
    if (u) {
      updateSourceObj(src, u);
      console.log(`Updated root source: ${src.title}`);
    }
  });
});

console.log(`Total source objects updated: ${updatedSourcesCount}`);

const newContent = objPrefix + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(dataPath, newContent, 'utf8');
console.log('Successfully wrote updated data to units/usa/data.js');

