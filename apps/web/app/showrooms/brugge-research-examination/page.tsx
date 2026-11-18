'use client';

import Link from 'next/link';
import SamanthaNarration from '../../components/SamanthaNarration';
import './showroom.css';

const documentPdf = '/' + encodeURIComponent('TA14_Brugge_Research_Examination_v4_Editorial_Corrected (2).pdf');

const studies = [
  {
    title: 'Developing Community-Level Policy and Practice to Reduce Traffic-Related Air Pollution Exposure',
    year: '2015', journal: 'Environmental Justice', doi: '10.1089/env.2015.0007',
    image: 'Reducing Traffic Pollution Exposure.png', method: 'Planning synthesis and multidisciplinary charrette',
    finding: 'Explores community-level options for near-roadway exposure: filtration, air-intake siting, buffers, and related land-use strategies.',
    boundary: 'Discussing an intervention option is not proof that it was installed or achieved a specified exposure or clinical benefit.',
    question: 'What installation, operation, maintenance, and monitoring records would demonstrate that one chosen intervention worked?',
    narration: 'Lesson one begins at the highway. Traffic-related pollution can affect people living and working near major roads. This 2015 paper examines an assortment of engineering and community planning responses, including filtration, intake placement and physical buffers. Those strategies are possibilities for a particular setting, not a randomized health outcome result. Before an institution claims an exposure reduction, it would need to identify the actual intervention, establish an appropriate baseline, document installation and operation, and measure the consequence. That last question is a proposed TA-14 examination, not a result of this paper.',
    caution: ''
  },
  {
    title: 'Visualizing Air Pollution: Communication of Environmental Health Information in a Chinese Immigrant Community',
    year: '2019', journal: 'Journal of Health Communication', doi: '10.1080/10810730.2019.1597949',
    image: 'Visualizing Air Quality in Chinatown.png', method: 'Community communication evaluation',
    finding: 'Examines visual and bilingual approaches to making near-roadway pollution information accessible to a Chinese immigrant community.',
    boundary: 'Understanding and engagement do not demonstrate measured exposure reduction or improvement in health.',
    question: 'Can a community-facing visualization show when, where, how and with what uncertainty the underlying data were produced?',
    narration: 'Lesson two changes the problem from technical control to understanding. A map or graphic may be scientifically grounded and still fail to reach the people most affected by the issue. This paper examines communication in a Chinese immigrant community through visual and bilingual approaches. The relevant outcome is communication, not an independently demonstrated improvement in air quality. A TA-14 research extension would ask whether each displayed measurement can be traced to its time, place, method and uncertainty. Better presentation is valuable; it is not the same as proven intervention performance.',
    caution: 'The uploaded artwork gives the wrong journal. Use the citation displayed in this lesson.'
  },
  {
    title: 'Two communities, one highway and the fight for clean air: the role of political history in shaping community engagement and environmental health research translation',
    year: '2020', journal: 'BMC Public Health', doi: '10.1186/s12889-020-09751-w',
    image: 'Two Communities, One Highway.png', method: 'Qualitative instrumental case study',
    finding: 'Examines Boston Chinatown and Somerville through interviews, observation and document review, with attention to their distinct political histories.',
    boundary: 'The qualitative comparison does not estimate a causal pollution reduction or establish one universally transferable organizing strategy.',
    question: 'How can a future decision record recognize meaningful community standing without conflating participation with statutory authority?',
    narration: 'Lesson three places two different communities alongside the same broad transportation concern. Boston Chinatown and Somerville have distinct political and institutional histories. The researchers examined how those histories shaped the reception and translation of air-pollution research. This is qualitative evidence about organizing and engagement pathways, not a controlled exposure-reduction experiment. The separate TA-14 question asks how affected community voices and legitimate decision authority should be represented in a future intervention record. We cannot erase the local history simply because two communities share an environmental threat.',
    caution: ''
  },
  {
    title: 'CBPR Partnerships and Near-Roadway Pollution: A Promising Strategy to Influence the Translation of Research into Practice',
    year: '2020', journal: 'Environments', doi: '10.3390/environments7060044',
    image: 'CBPR Partnerships for Cleaner Roadways.png', method: 'Thirteen key-informant interviews',
    finding: 'Reports how community-based participatory research partnerships may influence planning, attention and research translation.',
    boundary: 'Perceived influence is distinct from enacted policy, verified installation or observed reduction in pollution.',
    question: 'Which record would distinguish advice, a formal authorization, an intervention and its measured outcome?',
    narration: 'Lesson four is about partnerships. Community-based participatory research creates opportunities to shape research questions and interpretations together. The investigators used thirteen key-informant interviews to examine how these relationships can influence movement toward practice. Interviews can illuminate a decision process, but they do not independently prove that a regulation was enacted or that pollution declined. The proposed TA-14 extension is a traceability question: can a reader see exactly where a recommendation became an authorized action, and whether that action was later verified?',
    caution: ''
  },
  {
    title: 'An Evaluation of an Environmental Health Infographic in Community Settings',
    year: '2021', journal: 'INQUIRY', doi: '10.1177/00469580211059290',
    image: 'Traffic Air Pollution Health Infographic.png', method: 'One focus group, four interviews and 74 anonymous surveys',
    finding: 'Evaluates the understanding and usability of an environmental-health infographic about traffic-related ultrafine particles.',
    boundary: 'Favorable feedback about information is not evidence of a change in behavior, exposure or a clinical endpoint.',
    question: 'Would a future intervention separately measure information comprehension and physical performance?',
    narration: 'Lesson five examines the artifact people were asked to understand: the infographic. The published evaluation involved one focus group, four interviews, and seventy-four anonymous surveys. Its focus was whether environmental-health information communicated effectively to community members. The paper should not be transformed into a claim that the infographic itself reduced pollution. In a future examination, comprehension and real-world intervention performance would be separate endpoints. An accurate image can help someone understand an issue; it cannot stand in for an environmental measurement.',
    caution: 'The artwork is an illustrative replacement, not a reproduction of the study material.'
  },
  {
    title: 'Particulate Policy: An argument for a regulatory approach to transportation-related ultrafine particle exposure',
    year: '2021', journal: 'Metropolitan Area Planning Council · institutional policy report (21 June 2021)', doi: '',
    image: 'Particulate Policy_ Ultrafine Particle Exposure.png', method: 'Policy argument and synthesis',
    finding: 'Douglas Brugge and Sharon Ron argue for regulatory attention to transportation-related ultrafine particle exposure.',
    boundary: 'Policy recommendation is not legislative enactment, enforcement or independently measured improvement.',
    question: 'How should a record distinguish proposal, adopted requirement, enforced action and resulting environmental benefit?',
    narration: 'Lesson six takes us from community research to the policy arena. Douglas Brugge and Sharon Ron presented an argument for a regulatory response to transportation-related ultrafine particles in a June 2021 Metropolitan Area Planning Council report. A policy argument can identify a regulatory gap and suggest actions; it is not itself evidence that an agency adopted or enforced those proposals. TA-14 separately asks that each stage be attributable: proposal, legitimate approval, implementation and verified effect. A complete record must not silently skip any of those transitions.',
    caution: 'This is an institutional report, not a journal article. Do not attach a journal DOI to it.'
  },
  {
    title: 'Advancing Environmental Justice in the Community Using Charrette: A Case Study in Boston Chinatown',
    year: '2023', journal: 'Environmental Justice', doi: '10.1089/env.2022.0001',
    image: 'Boston Chinatown Community Charrette Infographic.png', method: 'Participatory planning case study',
    finding: 'Documents a Boston Chinatown charrette linking community concerns and priorities to possible environmental planning responses.',
    boundary: 'A workshop and its resulting proposals do not establish that controls were installed or that exposure fell.',
    question: 'Could a future reviewer trace a resident-identified priority to a specific approved and verified action?',
    narration: 'Lesson seven returns to Boston Chinatown, this time at a charrette: a collaborative design process that translates lived concerns into potential planning ideas. The important result is the documented participatory process and the proposals it generated. An imagined completed project should not be substituted for those actual findings. The next governance question is about continuity of community intent. If one of these proposals were ever pursued, could participants later see who approved it, what was built and whether it addressed their original concern?',
    caution: 'The DOI printed in the uploaded artwork is wrong. The corrected citation is below.'
  },
  {
    title: 'Communities catalyzing change with data to mitigate an invisible menace, traffic-related air pollution',
    year: '2024', journal: 'BMC Public Health', doi: '10.1186/s12889-024-17864-9',
    image: 'Communities Taking Action on Air Quality.png', method: 'Qualitative community process study: 24 interviews, ten observed meetings and documentary records',
    finding: 'Examines how people in Boston Chinatown and Somerville used evidence, relationships and organizing in research translation.',
    boundary: 'Documented engagement and pathways toward action do not prove a causal clinical effect or quantified exposure reduction.',
    question: 'What evidence would distinguish a promising community process from a completed and verified intervention?',
    narration: 'Lesson eight asks what happens when communities can engage with evidence about an otherwise hard-to-see hazard. The study draws on twenty-four interviews, observations of ten meetings and records covering several years. It examines organizing and research translation in Boston Chinatown and Somerville. The contribution is a documented account of social processes, not a field experiment demonstrating a specified change in pollutant concentration. TA-14 asks a separate follow-on question: when a community action is proposed, which actions can be independently verified, and where are unsuccessful or incomplete actions recorded?',
    caution: 'The DOI shown inside the artwork is inaccurate. The corrected source citation appears below.'
  },
  {
    title: 'Effect of HEPA Filtration Air Purifiers on Blood Pressure: A Pragmatic Randomized Crossover Trial',
    year: '2025', journal: 'Journal of the American College of Cardiology (JACC)', doi: '10.1016/j.jacc.2025.06.037',
    image: 'HEPA Filtration and Blood Pressure Trial.png', method: 'Pragmatic randomized crossover trial; 154 analyzed participants',
    finding: 'In participants with baseline systolic blood pressure of at least 120 mm Hg, the reported HEPA-versus-sham systolic contrast favored HEPA by 3.0 mm Hg (p = .04).',
    boundary: 'This subgroup result is not a significant benefit for every participant; no significant diastolic benefit was reported. Confidence intervals and model details remain under review.',
    question: 'Can filter operation, measured particle change and measured blood pressure each be audited as distinct endpoints?',
    narration: 'Lesson nine is a clinical trial, and its interpretation needs special care. In a randomized crossover study of portable HEPA versus sham filtration, one hundred fifty-four participants were analyzed. The reported subgroup with elevated baseline systolic pressure showed a three millimeter of mercury between-condition difference favoring HEPA. That does not mean the entire study population experienced a statistically significant blood-pressure benefit. The distinction between exposure, treatment adherence and clinical response must remain visible. A proposed TA-14 record could track those domains separately, but this trial did not test TA-14.',
    caution: 'The revised artwork reflects the sham control and a 3.0 mm Hg subgroup contrast, but its absolute chart values (about 133.2 and 130.2 mm Hg) are illustrative and must not be presented as observed group means without verification against the publication. Recheck embedded citation and subgroup wording.'
  },
  {
    title: 'Effect of HEPA filtration air purifiers on cognitive function from a secondary outcome analysis of a pragmatic randomized crossover trial',
    year: '2026', journal: 'Scientific Reports', doi: '10.1038/s41598-026-48063-8',
    image: 'HEPA Filtration and Cognitive Function.png', method: 'Secondary cognitive outcome analysis; 119 participants',
    finding: 'No statistically significant overall cognitive effect; an age-related subgroup signal was reported for Trail Making Test B among participants aged 40 or older.',
    boundary: 'A secondary subgroup pattern is not a general cognitive benefit; multiplicity, precision and prespecification require review.',
    question: 'Can an evidence record display the overall null comparison alongside the exploratory subgroup finding without favoring only the positive result?',
    narration: 'Lesson ten demonstrates why an overall null result cannot disappear behind a more interesting subgroup. In a secondary cognitive analysis of the filtration crossover study, one hundred nineteen participants were included. The overall cognitive comparison was not statistically significant. An age-related pattern on Trail Making Test B was reported among adults forty or older. The age signal is not proof of improvement in all participants. TA-14 asks how the full record could keep both findings together, including uncertainty and the distinction between prespecified and exploratory analyses.',
    caution: 'The source is a secondary analysis, not a separate first-line cognition trial.'
  },
  {
    title: 'Pro-inflammatory cytokines moderated by visceral adiposity from a pragmatic randomized crossover trial of portable HEPA air purifiers',
    year: '2026 online / 2027 volume', journal: 'American Journal of Preventive Cardiology', doi: '10.1016/j.ajpc.2026.101775',
    image: 'HEPA Filtration and Inflammatory Markers.png', method: 'Secondary biomarker analysis; 116 participants',
    finding: 'No overall IL-1β effect was reported; a high-visceral-adiposity subgroup of 12 participants showed a reported IL-1β reduction.',
    boundary: 'This is not evidence that visceral fat was reduced. A small subgroup cannot justify generalized anti-inflammatory claims; precision and multiplicity require checking.',
    question: 'How can an exploratory biomarker signal be presented without converting it into a clinical treatment claim?',
    narration: 'Lesson eleven turns to inflammatory biomarkers. The secondary analysis included one hundred sixteen participants and found no overall difference in interleukin one beta. The researchers also reported a reduction in that marker among a small subgroup of twelve people with higher visceral adiposity. The biomarker changed in that analysis; the study did not establish that the purifier reduced visceral fat. With such a small subgroup, confidence intervals, prespecification and multiple comparisons matter. This distinction must survive every illustration, caption and narration.',
    caution: 'Revised artwork now distinguishes the reported IL-1β subgroup signal from visceral adiposity, and shows the correct DOI. However, its study-design panel says HEPA versus typical indoor air; confirm and correct the sham-control comparison before public release.'
  },
  {
    title: 'Proposed TA-14 evidence-to-action boundary',
    year: 'Research proposal', journal: 'TA-14 Authority Governance Institution · not a paper by Dr. Brugge', doi: '',
    image: 'From Research Evidence to Justified Action.png', method: 'Prospective governance framework, not validated by these eleven publications',
    finding: 'Proposes traceable baseline evidence, applicable authority, established standing, bounded ALLOW / HOLD / DENY / ESCALATE decisions, and independent post-action verification.',
    boundary: 'No Brugge publication in this examination studied, tested, approved or validated TA-14. The proposal must be tested separately.',
    question: 'Would a prospectively registered comparison show more complete, reproducible and contestable intervention records than ordinary documentation?',
    narration: 'The final lesson is intentionally separate from the scientific literature. The preceding eleven publications explore different questions about exposure, communication, community action, regulation and selected effects of filtration. None evaluated TA-14. This exhibit introduces a proposed boundary for consequential environmental action. It would examine admissible evidence, applicable authority and established standing at the relevant moment, then preserve the disposition and the outcome. Its first validation should test record completeness, intervention fidelity, reviewer agreement and reproducibility, not claim improved health by association with another research team\'s findings.',
    caution: 'Proposed framework only. The research bibliography does not establish a collaboration, endorsement or validation by Dr. Brugge.'
  }
] as const;

const lessons=studies.map((s,i)=>({title:s.title,learned:s.finding,next:studies[i+1]?.title || 'Scientific verification and independently reviewable prospective testing'}));

export default function BruggeIndependentExamination(){
  return <main className="be-room"><div className="be-shell">
    <nav className="be-nav"><Link href="/">← TA-14 EXCHANGE</Link><Link href="/showrooms">ALL SHOWROOMS</Link><span>SCIENTIFIC REVIEW DRAFT · NOVEMBER 2026</span></nav>
    <header className="be-hero">
      <div className="be-kicker">TA-14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT EDUCATIONAL EXAMINATION</div>
      <h1>From air-pollution research<br/><em>to accountable action.</em></h1>
      <p>Eleven distinct publications associated with Dr. Douglas Brugge, followed by a separate TA-14 research proposal. Twelve visual lessons, source-specific interpretation boundaries, and individual Samantha narrations.</p>
      <div className="be-actions"><a href="#lessons">EXPLORE ALL 12 LESSONS ↓</a><a href={documentPdf} target="_blank" rel="noopener noreferrer">OPEN SCIENTIFIC REVIEW PDF ↗</a></div>
    </header>
    <section className="be-alert" aria-label="Scientific release notice">
      <strong>SCIENTIFIC REVIEW HOLD — NOT APPROVED FOR PUBLIC RELEASE</strong>
      <p>The uploaded artwork contains known citation and scientific-description errors. Corrected text below each illustration controls this working draft; embedded labels must not be relied upon. The accompanying PDF is also a review draft. Independent verification of source metadata, methods, estimates and authorship remains open.</p>
      <p>No study cited here tested TA-14. No authorship, partnership, endorsement, approval or peer review by Dr. Brugge or collaborators is implied. This is not a systematic review or an independent statistical replication.</p>
    </section>
    <section className="be-guide"><h2>Read each exhibit in four steps</h2><div className="be-guide-grid"><div><b>01 · SOURCE</b><p>Identify the actual study and its method.</p></div><div><b>02 · CONTRIBUTION</b><p>State what the evidence supports.</p></div><div><b>03 · BOUNDARY</b><p>Do not promote association, opinions or subgroups into unsupported proof.</p></div><div><b>04 · SEPARATE QUESTION</b><p>Ask what a future governed intervention would need to establish.</p></div></div></section>
    <div id="lessons" className="be-lessons">
      {studies.map((s,i)=><article className="be-lesson" id={'exhibit-'+String(i+1).padStart(2,'0')} key={s.image}>
        <div className="be-step">EXHIBIT {String(i+1).padStart(2,'0')} / 12 <span>{i===11?'SEPARATE TA-14 PROPOSAL':'SOURCE EXAMINATION'}</span></div>
        <h2>{s.title}</h2>
        <p className="be-citation"><strong>{s.year}</strong> · {s.journal}{s.doi&&<> · DOI: <a href={'https://doi.org/'+s.doi} target="_blank" rel="noopener noreferrer">{s.doi}</a></>}</p>
        <figure className="be-figure"><img loading={i<2?'eager':'lazy'} src={'/'+encodeURIComponent(s.image)} alt={'Illustrative educational artwork for exhibit '+(i+1)+': '+s.title+'. Refer to corrected study description beneath the image.'}/><figcaption>Conceptual educational artwork · not a study figure or a reproduction of measured results. Embedded claims and bibliographic labels have not completed fact-checking.</figcaption></figure>
        <div className="be-narrate"><SamanthaNarration lessons={lessons} lessonIndex={i} script={s.narration}/></div>
        {s.caution&&<p className="be-correction"><strong>ARTWORK CORRECTION REQUIRED:</strong> {s.caution}</p>}
        <div className="be-details"><section><h3>Study design</h3><p>{s.method}</p></section><section><h3>What the source contributes</h3><p>{s.finding}</p></section><section><h3>Interpretation boundary</h3><p>{s.boundary}</p></section><section><h3>TA-14 research question — proposed, not studied</h3><p>{s.question}</p></section></div>
        <div className="be-next">{i<studies.length-1?<a href={'#exhibit-'+String(i+2).padStart(2,'0')}>NEXT EXHIBIT · {String(i+2).padStart(2,'0')} ↓</a>:<a href="#verification">CONTINUE TO RELEASE CONTROL ↓</a>}</div>
      </article>)}
    </div>
    <section id="verification" className="be-review"><h2>Scientific release control</h2><p>Before publication, reconcile each figure against the cited source, correct embedded image errors, verify the three HEPA analyses' full results tables and confidence intervals, complete JACC author credit, confirm the MAPC report URL, and rewrite any narration challenged by source review. This room and its illustrations remain working material until those checks are complete.</p><a href={documentPdf} target="_blank" rel="noopener noreferrer">READ THE 28-PAGE REVIEW MASTER (PDF) ↗</a></section>
    <footer className="be-foot">TA-14 AUTHORITY GOVERNANCE INSTITUTION · SCIENTIFIC REVIEW DRAFT · NO THIRD-PARTY ENDORSEMENT · NOVEMBER 2026</footer>
  </div></main>;
}
