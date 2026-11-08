const fs = require('fs');
const path = require('path');

const curationL5L8 = {
  5: { // Lesson 5
    1: {
      words: [
        { term: "Greensboro Four", clue: "Four Black freshmen from North Carolina A&T College who initiated the direct-action sit-in movement at Woolworth's." },
        { term: "Woolworth lunch counter sit-in", clue: "The historic non-violent occupation of a segregated lunch counter on 1 February 1960 that rapidly spread across fifty-five Southern cities." },
        { term: "student direct action", clue: "Youth-led non-violent civil disobedience that bypassed cautious adult organizations to directly challenge Jim Crow institutions." }
      ],
      model_sentence: "When the <strong>Greensboro Four</strong> launched the <strong>Woolworth lunch counter sit-in</strong> in 1960, they ignited a nationwide wave of <strong>student direct action</strong> that revitalised the civil rights movement."
    },
    2: {
      words: [
        { term: "Ella Baker", clue: "Veteran civil rights strategist who organized the April 1960 Shaw University conference and advised student activists to remain independent from the SCLC." },
        { term: "SNCC founding", clue: "The creation of the Student Nonviolent Coordinating Committee to organize grassroots confrontation on the racial frontlines of the Deep South." },
        { term: "grassroots student leadership", clue: "Democratic, group-centered activism that empowered local youths rather than relying exclusively on charismatic ministers." }
      ],
      model_sentence: "Guided by veteran organizer <strong>Ella Baker</strong>, the <strong>SNCC founding</strong> established a dedicated network of <strong>grassroots student leadership</strong> across the rural Deep South."
    },
    3: {
      words: [
        { term: "CORE Freedom Rides", clue: "Interracial bus journeys organized in May 1961 by James Farmer to test federal desegregation compliance in interstate transit." },
        { term: "Boynton v. Virginia", clue: "The 1960 Supreme Court decision that declared racial segregation in interstate bus terminals and waiting rooms unconstitutional." },
        { term: "interracial direct action", clue: "Black and white volunteers deliberately traveling together and risking extreme violence to compel federal enforcement of civil rights law." }
      ],
      model_sentence: "To enforce the Supreme Court's ruling in <strong>Boynton v. Virginia</strong>, James Farmer mobilized the <strong>CORE Freedom Rides</strong> as a courageous demonstration of <strong>interracial direct action</strong>."
    },
    4: {
      words: [
        { term: "Anniston bus firebombing", clue: "The savage Mother's Day ambush on 14 May 1961 where a Ku Klux Klan mob firebombed a Greyhound bus carrying Freedom Riders." },
        { term: "Montgomery mob violence", clue: "The brutal beating of John Lewis, Jim Zwerg, and federal observers by a white mob at the Montgomery bus terminal while police stood aside." },
        { term: "Attorney General Robert F. Kennedy", clue: "Federal official who dispatched 400 federal marshals to Alabama and pressured the ICC to outlaw segregated transit." }
      ],
      model_sentence: "Following the horrific <strong>Anniston bus firebombing</strong> and subsequent <strong>Montgomery mob violence</strong>, <strong>Attorney General Robert F. Kennedy</strong> was forced to dispatch federal marshals to restore order."
    },
    5: {
      words: [
        { term: "Interstate Commerce Commission (ICC)", clue: "The federal regulatory agency that issued binding orders in November 1961 prohibiting racial segregation in interstate buses and terminals." },
        { term: "federal transit desegregation", clue: "The mandatory removal of 'White' and 'Colored' signs in waiting rooms and restrooms across all Southern interstate bus and rail stations." },
        { term: "freedom rider resilience", clue: "The steadfast refusal of student volunteers to abandon their non-violent campaign despite torture, mob beatings, and Parchman Penitentiary imprisonment." }
      ],
      model_sentence: "Driven by remarkable <strong>freedom rider resilience</strong>, direct pressure compelled the <strong>Interstate Commerce Commission (ICC)</strong> to enforce comprehensive <strong>federal transit desegregation</strong> in late 1961."
    }
  },
  6: { // Lesson 6
    1: {
      words: [
        { term: "Project C in Birmingham", clue: "The SCLC's spring 1963 confrontation campaign ('Confrontation') designed to provoke violent police retaliation and force desegregation in Birmingham, Alabama." },
        { term: "Bull Connor", clue: "The notoriously brutal Commissioner of Public Safety who unleashed police dogs and high-pressure firehoses on peaceful Black demonstrators." },
        { term: "Children's Crusade", clue: "The controversial but decisive deployment of thousands of school pupils into the streets of Birmingham in May 1963, filling city jails and shocking the nation." }
      ],
      model_sentence: "During <strong>Project C in Birmingham</strong>, public safety commissioner <strong>Bull Connor</strong> shocked the world by turning firehoses on schoolchildren marching in the <strong>Children's Crusade</strong>."
    },
    2: {
      words: [
        { term: "March on Washington for Jobs and Freedom", clue: "The historic gathering of 250,000 Americans at the Lincoln Memorial on 28 August 1963 demanding economic justice and civil rights legislation." },
        { term: "'I Have a Dream' speech", clue: "Dr Martin Luther King Jr.'s iconic keynote address defining the moral vision of racial harmony and constitutional equality." },
        { term: "Big Six civil rights leaders", clue: "The heads of the major civil rights organizations—including King, Randolph, Lewis, Farmer, Wilkins, and Young—who united to organize the mass march." }
      ],
      model_sentence: "At the 1963 <strong>March on Washington for Jobs and Freedom</strong> organized by the <strong>Big Six civil rights leaders</strong>, Dr King delivered his transformative <strong>'I Have a Dream' speech</strong>."
    },
    3: {
      words: [
        { term: "Civil Rights Act of 1964", clue: "Landmark federal legislation that prohibited discrimination in public accommodations, outlawed employment bias, and authorized federal school integration enforcement." },
        { term: "President Lyndon B. Johnson", clue: "US President who utilized formidable legislative leverage and invoked JFK's memory to break a 54-day Southern Senate filibuster." },
        { term: "Equal Employment Opportunity Commission (EEOC)", clue: "The federal agency established under Title VII of the 1964 Act to investigate and eliminate racial and sex discrimination in the workplace." }
      ],
      model_sentence: "Signed by <strong>President Lyndon B. Johnson</strong> after breaking a Southern filibuster, the <strong>Civil Rights Act of 1964</strong> established the <strong>Equal Employment Opportunity Commission (EEOC)</strong> to eradicate workplace discrimination."
    },
    4: {
      words: [
        { term: "Bloody Sunday in Selma", clue: "The brutal assault on 7 March 1965 where Alabama state troopers tear-gassed and clubbed 600 peaceful voting rights marchers at the Edmund Pettus Bridge." },
        { term: "Edmund Pettus Bridge", clue: "The iconic bridge spanning the Alabama River where state troopers under Jim Clark assaulted John Lewis and voting rights activists." },
        { term: "Dallas County voter registration", clue: "The grassroots campaign spearheaded by Amelia Boynton and SNCC to challenge the fact that only 2% of eligible Black residents were registered to vote." }
      ],
      model_sentence: "The vicious state trooper charge across the <strong>Edmund Pettus Bridge</strong> on <strong>Bloody Sunday in Selma</strong> exposed the violent suppression of <strong>Dallas County voter registration</strong> to international scrutiny."
    },
    5: {
      words: [
        { term: "Voting Rights Act of 1965", clue: "Historic federal law that banned literacy tests, authorized federal voting registrars, and placed discriminatory states under federal preclearance supervision." },
        { term: "federal voting examiners", clue: "Federal officials empowered to bypass obstructive local registrars and directly register minority citizens in the Deep South." },
        { term: "literacy test abolition", clue: "The complete nationwide ban on discriminatory comprehension and literacy tests that had blocked Black Southern voters for generations." }
      ],
      model_sentence: "Through the <strong>literacy test abolition</strong> and the deployment of <strong>federal voting examiners</strong>, the <strong>Voting Rights Act of 1965</strong> dismantled the institutional foundation of Southern disenfranchisement."
    }
  },
  7: { // Lesson 7
    1: {
      words: [
        { term: "Malcolm X", clue: "Fiery Black nationalist leader who rejected non-violence and racial integration, advocating armed self-defense, racial pride, and economic independence." },
        { term: "Nation of Islam (NOI)", clue: "The Black Muslim religious and political movement led by Elijah Muhammad that taught Black supremacy and strict separation from white society." },
        { term: "armed self-defense", clue: "The philosophical doctrine asserting the moral right and duty of Black Americans to defend themselves and their communities 'by any means necessary'." }
      ],
      model_sentence: "Rejecting non-violent integrationism, <strong>Malcolm X</strong> used the platform of the <strong>Nation of Islam (NOI)</strong> to champion Black nationalism and the constitutional right to <strong>armed self-defense</strong>."
    },
    2: {
      words: [
        { term: "March Against Fear", clue: "The June 1966 Mississippi march initiated by James Meredith where emerging divisions between King's SCLC and radical student activists erupted publicly." },
        { term: "Stokely Carmichael", clue: "Elected chairman of SNCC in 1966 who popularized the 'Black Power' slogan, calling for Black political control, self-reliance, and racial pride." },
        { term: "'Black Power' slogan", clue: "The militant rallying cry chanted by SNCC and CORE members in Greenwood, Mississippi, signaling a decisive shift away from non-violent assimilation." }
      ],
      model_sentence: "During the 1966 <strong>March Against Fear</strong> in Mississippi, SNCC leader <strong>Stokely Carmichael</strong> electrified young activists by popularizing the revolutionary <strong>'Black Power' slogan</strong>."
    },
    3: {
      words: [
        { term: "Black Panther Party", clue: "Marxist-Leninist revolutionary organization founded in Oakland, California, in October 1966 to combat police brutality and promote community socialism." },
        { term: "Huey P. Newton & Bobby Seale", clue: "Radical college student founders who authored the Panther platform, wore black leather jackets and berets, and conducted armed citizen patrols." },
        { term: "Ten-Point Program", clue: "The foundational Panther manifesto demanding full employment, decent housing, fair trials by Black juries, and an end to police brutality." }
      ],
      model_sentence: "Founded in Oakland by <strong>Huey P. Newton & Bobby Seale</strong>, the <strong>Black Panther Party</strong> published their revolutionary <strong>Ten-Point Program</strong> demanding social justice and an end to police brutality."
    },
    4: {
      words: [
        { term: "Free Breakfast for Children Program", clue: "Community survival initiative providing nutritious daily meals to thousands of impoverished inner-city children before school." },
        { term: "armed citizen patrols", clue: "Armed Panther members patrolling Oakland streets with loaded shotguns and law books to monitor police conduct and prevent police violence." },
        { term: "FBI COINTELPRO surveillance", clue: "J. Edgar Hoover's covert domestic counterintelligence program designed to infiltrate, disrupt, and destroy Black nationalist organizations." }
      ],
      model_sentence: "While running the popular <strong>Free Breakfast for Children Program</strong> alongside <strong>armed citizen patrols</strong>, the Panthers were ruthlessly targeted by covert <strong>FBI COINTELPRO surveillance</strong>."
    },
    5: {
      words: [
        { term: "1968 Mexico City Olympics", clue: "The international athletic games that became a global stage for civil rights protest during the civil unrest of autumn 1968." },
        { term: "Tommie Smith & John Carlos", clue: "African American sprinters who won gold and bronze in the 200m and bowed their heads while raising gloved fists on the medal podium." },
        { term: "Olympic podium black fist salute", clue: "The silent, defiant gesture honoring the Olympic Project for Human Rights and protesting ongoing American racial oppression." }
      ],
      model_sentence: "At the <strong>1968 Mexico City Olympics</strong>, sprinters <strong>Tommie Smith & John Carlos</strong> stunned the world by raising their hands in an <strong>Olympic podium black fist salute</strong>."
    }
  },
  8: { // Lesson 8
    1: {
      words: [
        { term: "Watts Rebellion", clue: "A six-day uprising in Los Angeles in August 1965 triggered by the brutal arrest of Marquette Frye, resulting in 34 deaths and $40 million in damages." },
        { term: "police brutality grievances", clue: "Deep-seated anger among urban Black residents over discriminatory policing, stop-and-frisk harassment, and systemic municipal neglect." },
        { term: "California National Guard", clue: "14,000 state military troops deployed with machine guns and armoured vehicles to suppress the widespread rebellion in South Los Angeles." }
      ],
      model_sentence: "Driven by systemic <strong>police brutality grievances</strong> and economic despair, the 1965 <strong>Watts Rebellion</strong> forced the governor to deploy the <strong>California National Guard</strong> to suppress urban rioting."
    },
    2: {
      words: [
        { term: "Chicago Freedom Movement", clue: "Dr Martin Luther King Jr.'s 1966 northern campaign tackling de facto housing discrimination, urban slum exploitation, and educational inequality." },
        { term: "slum tenement exploitation", clue: "The predatory rental practices of white slumlords who charged extortionate rents to Black tenants confined to segregated northern ghettoes." },
        { term: "Marquette Park white mobs", clue: "Violent white counter-protesters who pelted Dr King and peaceful marchers with bricks, bottles, and swastikas in suburban Chicago." }
      ],
      model_sentence: "When King's <strong>Chicago Freedom Movement</strong> marched against <strong>slum tenement exploitation</strong>, they were viciously attacked by <strong>Marquette Park white mobs</strong> hurling rocks and bricks."
    },
    3: {
      words: [
        { term: "1967 Detroit rebellion", clue: "The deadly five-day insurrection in July 1967 following a police raid on an unlicensed drinking club, resulting in 43 deaths and 7,000 arrests." },
        { term: "urban ghetto conditions", clue: "Pervasive Northern poverty, substandard segregated schooling, and massive youth unemployment that bred hopeless economic disenfranchisement." },
        { term: "federal paratrooper deployment", clue: "President Lyndon B. Johnson's deployment of the 82nd and 101st Airborne Divisions with tanks into Detroit to regain control of burning streets." }
      ],
      model_sentence: "Explosive anger over squalid <strong>urban ghetto conditions</strong> fueled the catastrophic <strong>1967 Detroit rebellion</strong>, forcing a full-scale <strong>federal paratrooper deployment</strong> to restore civil authority."
    },
    4: {
      words: [
        { term: "Kerner Commission", clue: "The bipartisan National Advisory Commission on Civil Disorders appointed by LBJ to investigate the root causes of urban racial violence." },
        { term: "'two societies, one black, one white'", clue: "The famous warning issued by the Kerner Report that America was rapidly splitting into separate and unequal racial communities." },
        { term: "systemic white racism", clue: "The conclusion identifying institutional white prejudice, police misconduct, and chronic poverty as the primary instigators of inner-city riots." }
      ],
      model_sentence: "The landmark 1968 <strong>Kerner Commission</strong> warned that <strong>systemic white racism</strong> was inexorably splitting America into <strong>'two societies, one black, one white'</strong>."
    },
    5: {
      words: [
        { term: "Martin Luther King Jr. assassination", clue: "The murder of Dr King on 4 April 1968 at the Lorraine Motel in Memphis, Tennessee, triggering riots across more than 100 American cities." },
        { term: "Fair Housing Act (1968)", clue: "The landmark Civil Rights Act passed days after King's murder that outlawed racial discrimination in the sale, rental, and financing of housing." },
        { term: "Holy Week urban uprisings", clue: "The nationwide wave of violent urban unrest and arson that erupted across Washington D.C., Chicago, and Baltimore following King's death." }
      ],
      model_sentence: "Following the tragic <strong>Martin Luther King Jr. assassination</strong> and subsequent <strong>Holy Week urban uprisings</strong>, Congress hurriedly enacted the landmark <strong>Fair Housing Act (1968)</strong>."
    }
  }
};

module.exports = curationL5L8;

