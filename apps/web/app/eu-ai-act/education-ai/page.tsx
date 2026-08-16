import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Education AI',
  description:'Understand when AI used for admissions, student assessment, learning outcomes, placement, proctoring, or access to education may be high-risk under the EU AI Act.',
  alternates:{canonical:'/eu-ai-act/education-ai'},
  keywords:['EU AI Act education AI','AI admissions compliance EU','student assessment AI high risk','AI proctoring EU AI Act','education AI regulation Europe','Annex III education AI'],
  openGraph:{title:'EU AI Act Compliance for Education AI | TA-14',description:'A governed guide to high-risk education and vocational-training AI under Annex III.',url:'/eu-ai-act/education-ai',type:'website'}
};

const cards=[
  {title:'IS THE AI DETERMINING ACCESS OR ADMISSION?',copy:'Annex III identifies certain AI systems used to determine access or admission to educational or vocational-training institutions and programmes as high-risk.'},
  {title:'IS THE AI EVALUATING LEARNING OUTCOMES OR EDUCATION LEVEL?',copy:'Systems intended to evaluate learning outcomes, assess an individual’s appropriate education level, or materially influence the level of education or training a person receives can also fall into the high-risk education category.'},
  {title:'IS THE SYSTEM MONITORING STUDENTS DURING TESTS?',copy:'AI used to monitor or detect prohibited behaviour during tests is included among high-risk education use cases. Separate this from prohibited emotion-recognition uses in education institutions.'},
  {title:'CAN YOU PROVE HOW THE SYSTEM AFFECTS THE STUDENT?',copy:'Preserve intended purpose, decision role, system version, data inputs, evaluation criteria, human oversight, appeal/escalation routes, testing, performance limits, notices, and changes affecting continued reliance.'},
];

const steps=[
  {title:'Define the exact educational decision',copy:'Admission, placement, grading, learning-outcome evaluation, proctoring, tutoring, scheduling, recommendation, and administrative assistance should not be treated as one category. Classify the real intended purpose.'},
  {title:'Determine whether Annex III high-risk classification applies',copy:'Map the system against Article 6 and Annex III, preserving unresolved facts and any claimed Article 6(3) exclusion instead of assuming every educational tool is automatically high-risk.'},
  {title:'Bind oversight and evidence to the student-impact pathway',copy:'Connect data governance, technical documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity, review procedures, and appeal or escalation controls to the educational decision being influenced.'},
  {title:'Revalidate when the model or educational use changes',copy:'A tool that begins as tutoring support can become a materially different governance problem if it later ranks students, determines admission, changes placement, scores exams, or influences access to programmes.'},
];

const faqs=[
  {q:'Is AI used for school or university admissions high-risk under the EU AI Act?',a:'Certain AI systems intended to determine access or admission to educational or vocational-training institutions or programmes are listed in Annex III as high-risk.'},
  {q:'What about AI that grades or evaluates students?',a:'Certain systems used to evaluate learning outcomes, assess appropriate education level, or materially influence the level of education or training a person receives are also included in the high-risk education category.'},
  {q:'Is AI proctoring high-risk?',a:'Certain AI systems intended to monitor or detect prohibited behaviour during tests are listed as high-risk in Annex III.'},
  {q:'Can schools use emotion-recognition AI?',a:'The AI Act prohibits certain emotion-recognition uses in education institutions, except where the use is intended for medical or safety reasons. This is a separate question from the Annex III high-risk education categories.'},
  {q:'Are all education AI tools high-risk?',a:'No. Classification depends on intended purpose. Administrative tools, general tutoring, content generation, scheduling, or other limited-support uses may follow different routes depending on what the system actually does and how it is used.'},
  {q:'Does TA-14 certify an education AI system as compliant?',a:'No. TA-14 can preserve system identity, classification basis, evidence, gaps, student-impact pathways, changes, and revalidation history. It does not itself provide legal advice, conformity assessment, certification, or regulatory approval.'},
];

export default function EducationAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · EDUCATION · VOCATIONAL TRAINING · ANNEX III"
  title="WHEN AI SHAPES A STUDENT’S PATH,"
  accent="THE DECISION HAS TO BE GOVERNABLE."
  intro="Education AI becomes high-stakes when it influences admission, placement, learning outcomes, assessment, access, or testing. The critical question is not whether software is used in a school—it is what decision the AI can materially influence and what evidence supports that use."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Annex III Education and Training"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation identifies certain education and vocational-training AI use cases as high-risk, including access or admission, assignment to programmes, evaluation of learning outcomes, assessment of education level, and monitoring prohibited behaviour during tests. It separately prohibits certain emotion-recognition uses in education institutions except for medical or safety reasons."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=education-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
