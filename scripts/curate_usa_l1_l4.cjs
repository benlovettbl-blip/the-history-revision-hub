const fs = require('fs');
const path = require('path');

const curationL1L4 = {
  1: { // Lesson 1
    1: {
      words: [
        { term: "de jure segregation", clue: "Legal separation of races enforced by state and municipal Jim Crow statutes across seventeen Southern states." },
        { term: "US Supreme Court", clue: "The highest federal court whose 1896 ruling constitutionally legitimized state-enforced racial segregation under the 'separate but equal' doctrine." },
        { term: "Plessy v. Ferguson", clue: "The landmark 1896 Supreme Court decision establishing the legal fiction of 'separate but equal' that anchored Jim Crow for six decades." }
      ],
      model_sentence: "In 1896, the <strong>US Supreme Court</strong> entrenched <strong>de jure segregation</strong> across the American South by ruling in <strong>Plessy v. Ferguson</strong> that racially separate public accommodations were constitutionally permissible."
    },
    2: {
      words: [
        { term: "Jim Crow codes", clue: "A comprehensive web of state laws mandating the physical separation of Black and white Americans across schools, transport, healthcare, and daily life." },
        { term: "Southern State Legislatures", clue: "State governments dominated by white segregationists that systematically denied civil rights and municipal funding to Black communities." },
        { term: "disenfranchisement", clue: "The systematic exclusion of Black Americans from the ballot box using poll taxes, literacy tests, and violent intimidation." }
      ],
      model_sentence: "Following Reconstruction, <strong>Southern State Legislatures</strong> enforced <strong>Jim Crow codes</strong> and widespread voter <strong>disenfranchisement</strong> to maintain total white supremacy over Black citizens."
    },
    3: {
      words: [
        { term: "poll taxes and literacy tests", clue: "Discriminatory administrative hurdles deliberately designed by county registrars to disqualify Black citizens from voting." },
        { term: "Southern registrars & vigilantes", clue: "White local officials and Ku Klux Klan terror groups who used economic blackmail and physical violence to block Black voter registration." },
        { term: "NAACP legal strategy", clue: "The incremental courtroom campaign led by Charles Hamilton Houston and Thurgood Marshall to challenge discriminatory state laws under the 14th Amendment." }
      ],
      model_sentence: "To overcome the intimidation of <strong>Southern registrars & vigilantes</strong> who weaponized <strong>poll taxes and literacy tests</strong>, Thurgood Marshall developed a methodical <strong>NAACP legal strategy</strong> in federal courts."
    },
    4: {
      words: [
        { term: "14th Amendment Equal Protection", clue: "The constitutional clause prohibiting states from denying any person equal protection of the laws, used as the primary weapon against segregation." },
        { term: "NAACP Legal Defense Fund", clue: "The legal arm of the NAACP established in 1940 to finance and argue constitutional test cases dismantling segregation in education and interstate travel." },
        { term: "CORE", clue: "Congress of Racial Equality, founded in 1942 by James Farmer and Bayard Rustin to challenge racial discrimination through non-violent direct action." }
      ],
      model_sentence: "While the <strong>NAACP Legal Defense Fund</strong> used the <strong>14th Amendment Equal Protection</strong> clause to overturn discriminatory precedents, activists in <strong>CORE</strong> pioneered non-violent direct action in Northern cities."
    },
    5: {
      words: [
        { term: "Double V Campaign", clue: "The wartime slogan urging Black Americans to fight for victory over fascism abroad and victory over racial discrimination at home." },
        { term: "Executive Order 9981", clue: "President Harry S. Truman's historic 1948 directive mandating the desegregation of the United States Armed Forces." },
        { term: "federal desegregation limits", clue: "The inability of presidential executive orders alone to overcome entrenched state-level segregation without federal legislation or court enforcement." }
      ],
      model_sentence: "Energised by the wartime <strong>Double V Campaign</strong>, civil rights pressure persuaded Truman to issue <strong>Executive Order 9981</strong> desegregating the military, though it encountered <strong>federal desegregation limits</strong> in the civilian South."
    }
  },
  2: { // Lesson 2
    1: {
      words: [
        { term: "Brown v. Board of Education", clue: "The historic 1954 Supreme Court decision ruling that segregated public schools are inherently unequal and violate the 14th Amendment." },
        { term: "psychological doll tests", clue: "Empirical research by Kenneth and Mamie Clark demonstrating that racial segregation inflicted severe psychological damage on Black children's self-worth." },
        { term: "Chief Justice Earl Warren", clue: "Supreme Court Chief Justice who forged a unanimous 9-0 decision declaring that separate educational facilities are inherently unequal." }
      ],
      model_sentence: "Citing Kenneth Clark's <strong>psychological doll tests</strong> to prove segregation harmed children, <strong>Chief Justice Earl Warren</strong> delivered the unanimous <strong>Brown v. Board of Education</strong> ruling in 1954."
    },
    2: {
      words: [
        { term: "Southern Manifesto", clue: "A 1956 declaration signed by 101 Southern congressmen pledging to resist school desegregation by all lawful means." },
        { term: "Brown II 'all deliberate speed'", clue: "The 1955 Supreme Court implementation ruling whose vague phrasing allowed Southern states to delay desegregation indefinitely." },
        { term: "Massive Resistance", clue: "A coordinated campaign of political defiance and legal obstruction orchestrated by Southern state leaders to thwart school integration." }
      ],
      model_sentence: "Southern politicians exploited the ambiguous phrase <strong>Brown II 'all deliberate speed'</strong> to organize <strong>Massive Resistance</strong>, formalised when 101 congressmen signed the <strong>Southern Manifesto</strong>."
    },
    3: {
      words: [
        { term: "Little Rock Nine", clue: "Nine brave Black students selected by Daisy Bates to integrate Central High School in Little Rock, Arkansas, in September 1957." },
        { term: "Governor Orval Faubus", clue: "The segregationist Arkansas governor who deployed armed troops to prevent the Little Rock Nine from entering Central High School." },
        { term: "Arkansas National Guard", clue: "State militia units commanded by Faubus to encircle the school and physically bar the Black teenagers from entering." }
      ],
      model_sentence: "In September 1957, <strong>Governor Orval Faubus</strong> defied federal court integration orders by deploying the <strong>Arkansas National Guard</strong> to physically turn away the <strong>Little Rock Nine</strong>."
    },
    4: {
      words: [
        { term: "President Dwight D. Eisenhower", clue: "US President who intervened with federal military force to uphold the authority of federal courts against state insurrection." },
        { term: "101st Airborne Division", clue: "Elite federal paratroopers dispatched with bayonets fixed to protect the nine Black students from violent white mobs." },
        { term: "Executive Order 10730", clue: "Presidential directive federalizing the Arkansas National Guard and placing Little Rock under federal military escort." }
      ],
      model_sentence: "When white mobs besieged the school, <strong>President Dwight D. Eisenhower</strong> issued <strong>Executive Order 10730</strong>, dispatching 1,200 soldiers of the <strong>101st Airborne Division</strong> to escort the students inside."
    },
    5: {
      words: [
        { term: "The Lost Year", clue: "The 1958–59 school year when Governor Faubus shut down all Little Rock public high schools to prevent any Black students from attending." },
        { term: "segregated private academies", clue: "Private, whites-only schools funded through state tuition vouchers designed to circumvent federal desegregation orders." },
        { term: "Cooper v. Aaron", clue: "The 1958 Supreme Court ruling affirming that constitutional rights cannot be nullified by state officials or public hostility." }
      ],
      model_sentence: "During <strong>The Lost Year</strong>, Faubus closed all public high schools to redirect white students to <strong>segregated private academies</strong>, until the Supreme Court ruled in <strong>Cooper v. Aaron</strong> that state nullification was unconstitutional."
    }
  },
  3: { // Lesson 3
    1: {
      words: [
        { term: "Rosa Parks", clue: "Respected NAACP secretary whose courageous refusal to give up her bus seat sparked the citywide Montgomery Bus Boycott." },
        { term: "Women's Political Council (WPC)", clue: "Grassroots organization led by Jo Ann Robinson that mimeographed 35,000 leaflets overnight mobilizing the bus boycott." },
        { term: "James F. Blake", clue: "Segregationist bus driver whose demand for Parks to vacate her seat led directly to her arrest under Montgomery municipal codes." }
      ],
      model_sentence: "After bus driver <strong>James F. Blake</strong> had <strong>Rosa Parks</strong> arrested for refusing to vacate her seat, Jo Ann Robinson and the <strong>Women's Political Council (WPC)</strong> mobilised an overnight citywide boycott."
    },
    2: {
      words: [
        { term: "Montgomery Improvement Association", clue: "The coordination organization established by Black community leaders to oversee and sustain the bus boycott." },
        { term: "Martin Luther King Jr.", clue: "The 26-year-old Baptist minister chosen to lead the MIA, whose electrifying oratory articulated the philosophy of non-violent resistance." },
        { term: "Holt Street Baptist Church", clue: "The historic sanctuary where 5,000 Black citizens gathered on 5 December 1955 to vote overwhelmingly to continue the boycott." }
      ],
      model_sentence: "Black community leaders formed the <strong>Montgomery Improvement Association</strong> and elected <strong>Martin Luther King Jr.</strong>, who inspired 5,000 boycott supporters at the <strong>Holt Street Baptist Church</strong>."
    },
    3: {
      words: [
        { term: "300-car pool network", clue: "A sophisticated, community-run transport system operating from forty pickup stations that transported 30,000 Black commuters daily." },
        { term: "Black church network", clue: "The spiritual and financial backbone of the movement that purchased church station wagons and coordinated volunteer drivers." },
        { term: "economic attrition", clue: "The severe financial losses inflicted on the Montgomery City Lines bus company as 70% of its regular fare-paying passengers refused to ride." }
      ],
      model_sentence: "By establishing a volunteer <strong>300-car pool network</strong> funded through the <strong>Black church network</strong>, boycotters maintained 381 days of <strong>economic attrition</strong> against the city transit company."
    },
    4: {
      words: [
        { term: "Browder v. Gayle", clue: "The landmark federal lawsuit filed on behalf of Aurelia Browder that declared bus segregation in Alabama unconstitutional under the 14th Amendment." },
        { term: "US Supreme Court", clue: "The nation's highest court which upheld the federal district court ruling on 13 November 1956, outlawing segregation on public buses." },
        { term: "SCLC founding", clue: "The establishment of the Southern Christian Leadership Conference in 1957 to coordinate non-violent campaigns across the South under Dr King." }
      ],
      model_sentence: "The boycott achieved decisive legal victory when the <strong>US Supreme Court</strong> affirmed <strong>Browder v. Gayle</strong>, an outcome that directly inspired the <strong>SCLC founding</strong> in 1957."
    },
    5: {
      words: [
        { term: "integrated bus transit", clue: "The historic resumption of public transit on 21 December 1956 with Black and white passengers boarding and sitting without racial restriction." },
        { term: "white backlash bombings", clue: "Retaliatory violence by Ku Klux Klan snipers and bombers who targeted integrated buses and bombed Black churches and Dr King's home." },
        { term: "non-violent direct action", clue: "The tactical philosophy proving that disciplined, mass non-cooperation could successfully defeat entrenched Jim Crow institutions." }
      ],
      model_sentence: "Although <strong>white backlash bombings</strong> terrorized Montgomery neighborhoods, the introduction of <strong>integrated bus transit</strong> proved the decisive power of <strong>non-violent direct action</strong>."
    }
  },
  4: { // Lesson 4
    1: {
      words: [
        { term: "White Citizens' Councils", clue: "Organizations of middle-class white professionals and politicians formed in 1954 to wage economic warfare against integrationists." },
        { term: "economic intimidation", clue: "The systematic denial of mortgages, bank credit, farm subsidies, and employment to Black activists who registered to vote or challenged Jim Crow." },
        { term: "Robert B. Patterson", clue: "Mississippi plantation manager who founded the first Citizens' Council in Indianola, rapidly spreading the network across the South." }
      ],
      model_sentence: "Founded by <strong>Robert B. Patterson</strong> in Mississippi, the <strong>White Citizens' Councils</strong> deployed brutal <strong>economic intimidation</strong> to strip civil rights activists of jobs and credit."
    },
    2: {
      words: [
        { term: "Emmett Till lynching", clue: "The horrific abduction and murder of 14-year-old Chicago youth Emmett Till in Money, Mississippi, for allegedly whistling at a white woman." },
        { term: "Roy Bryant & J.W. Milam", clue: "The two white men who kidnapped, beat, shot, and sank Emmett Till in the Tallahatchie River with a 75-pound cotton-gin fan." },
        { term: "Mamie Till-Mobley open casket", clue: "The courageous decision by Till's mother to hold an open-casket funeral in Chicago, exposing the gruesome reality of lynching to the world." }
      ],
      model_sentence: "Following the horrific <strong>Emmett Till lynching</strong> by <strong>Roy Bryant & J.W. Milam</strong> in Mississippi, <strong>Mamie Till-Mobley open casket</strong> funeral galvanized international outrage against white supremacy."
    },
    3: {
      words: [
        { term: "all-white jury acquittal", clue: "The verdict returned in just 67 minutes by twelve white men in Sumner, Mississippi, declaring Bryant and Milam not guilty of murder." },
        { term: "Moses Wright courtroom testimony", clue: "Till's 64-year-old great-uncle who defied lethal danger by standing in open court and pointing directly at the killers: 'There he is.'" },
        { term: "Look magazine confession", clue: "The paid 1956 interview in which Bryant and Milam admitted in detail how they tortured and murdered Emmett Till, protected by double jeopardy." }
      ],
      model_sentence: "Despite the heroic <strong>Moses Wright courtroom testimony</strong> identifying the abductors, an <strong>all-white jury acquittal</strong> allowed the killers to publish a brazen <strong>Look magazine confession</strong> months later."
    },
    4: {
      words: [
        { term: "Ku Klux Klan resurgence", clue: "The violent re-emergence of secret white vigilante cells carrying out nocturnal cross-burnings, beatings, and murders." },
        { term: "dynamite terrorism", clue: "The covert use of industrial explosives against Black homes, churches, and synagogues to terrorize communities seeking equality." },
        { term: "Birmingham bombing wave", clue: "Over fifty unsolved racial bombings in Birmingham, Alabama, earning the segregated industrial city the grim nickname 'Bombingham'." }
      ],
      model_sentence: "A deadly <strong>Ku Klux Klan resurgence</strong> unleashed <strong>dynamite terrorism</strong> across the South, culminating in the <strong>Birmingham bombing wave</strong> targeting civil rights leaders."
    },
    5: {
      words: [
        { term: "Civil Rights Act of 1957", clue: "The first federal civil rights legislation passed since Reconstruction, signed by Eisenhower to protect minority voting rights." },
        { term: "Strom Thurmond filibuster", clue: "The record-breaking 24-hour-and-18-minute lone filibuster staged by South Carolina's senator to delay and weaken the civil rights bill." },
        { term: "Voting Rights Division weakness", clue: "Provisions requiring jury trials for criminal contempt, which effectively prevented Southern all-white juries from convicting registrars." }
      ],
      model_sentence: "Although weakened by the record <strong>Strom Thurmond filibuster</strong>, the <strong>Civil Rights Act of 1957</strong> established a federal commission, despite the structural <strong>Voting Rights Division weakness</strong>."
    }
  }
};

module.exports = curationL1L4;

