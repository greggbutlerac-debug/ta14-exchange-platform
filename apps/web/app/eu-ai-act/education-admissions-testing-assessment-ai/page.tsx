import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Education Admissions, Testing and Student Assessment AI',
  description:'Understand EU AI Act obligations for AI used in education admissions, student placement, learning-outcome assessment, education-level decisions and test monitoring, including Annex III high-risk classification, prohibited emotion inference, human oversight and evidence.',
  alternates:{canonical:'/eu-ai-act/education-admissions-testing-assessment-ai'},
  keywords:['EU AI Act education AI','AI admissions compliance EU','student assessment AI high risk','AI exam monitoring EU AI Act','Annex III education AI','AI proctoring compliance Europe'],
  openGraph:{title:'EU AI Act Compliance for Education Admissions, Testing and Student Assessment AI | TA-14',description:'A governed guide to high-risk education AI, admissions, assessment, placement and test monitoring under the EU AI Act.',url:'/eu-ai-act/education-admissions-testing-assessment-ai',type:'website'}
};

const cards=[
  {title:'IS AI DETERMINING ACCESS, ADMISSION OR PLACEMENT?',copy:'Annex III treats specified AI used to determine access or admission to education and vocational training institutions or programmes, or to assign people to those institutions or programmes, as high-risk.'},
  {title:'IS AI EVALUATING LEARNING OUTCOMES OR EDUCATION LEVEL?',copy:'Systems used to evaluate learning outcomes, assess the appropriate level of education for an individual, or materially influence the level of education or training a person receives or can access are also listed as high-risk.'},
  {title:'IS THE SYSTEM MONITORING OR DETECTING PROHIBITED BEHAVIOUR DURING TESTS?',copy:'Annex III includes AI used to monitor and detect prohibited behaviour of students during tests. That can include consequential proctoring or test-monitoring functions where the system materially affects academic outcomes.'},
  {title:'IS THE SYSTEM INFERRING STUDENT EMOTIONS?',copy:'Article 5 prohibits AI used to infer emotions of natural persons in education institutions, except where the system is intended for medical or safety reasons. A prohibited use cannot be made permissible merely by adding high-risk controls.'},
];

const steps=[
  {title:'Define the exact education function',copy:'Separate admissions, programme placement, learning-outcome assessment, education-level determination, tutoring, scheduling, proctoring, misconduct detection and purely administrative support. Different functions can create different legal routes.'},
  {title:'Test prohibited practices before high-risk classification',copy:'If the system infers emotions in an education institution, assess the Article 5 prohibition first. Do not treat prohibited emotion inference as an ordinary Annex III deployment unless a valid medical or safety exception applies.'},
  {title:'Bind human review and evidence to the student-impact decision',copy:'Connect source data, system output, grading or placement logic, human reviewer, decision authority, override, notice, challenge or appeal pathway, logs, performance and bias evidence, and the resulting education outcome.'},
  {title:'Revalidate after model, curriculum, policy or workflow changes',copy:'A new model, changed grading rubric, admissions criterion, proctoring feature, new data source, broader automation or removed human checkpoint can make the previous classification and evidence stale.'},
];

const faqs=[
  {q:'Is AI used for university or school admissions high-risk under the EU AI Act?',a:'Certain systems are. Annex III includes AI used to determine access or admission to education and vocational training institutions or programmes and to assign people to those institutions or programmes.'},
  {q:'Is student grading or assessment AI high-risk?',a:'It can be. Annex III includes AI used to evaluate learning outcomes, assess the appropriate level of education for an individual, or materially influence the level of education or training a person receives or can access.'},
  {q:'Is AI proctoring high-risk?',a:'Annex III includes AI used to monitor and detect prohibited behaviour of students during tests. The exact technical function and degree of influence still matter, but consequential test-monitoring systems can fall directly within the high-risk route.'},
  {q:'Can schools use AI to infer student emotions?',a:'Article 5 prohibits emotion inference in education institutions, except where the system is intended for medical or safety reasons. That prohibition applies separately from Annex III high-risk rules.'},
  {q:'When do Annex III education high-risk rules apply?',a:'Current European Commission guidance states that rules for Annex III education systems apply from 2 December 2027.'},
  {q:'What evidence should be preserved for education AI?',a:'Preserve system identity and version, intended purpose, provider and deployer roles, student or programme scope, input data, scoring or placement outputs, human review, overrides, notices, logs, performance and bias evidence, appeals or challenges, material changes and revalidation history.'},
  {q:'Does TA-14 certify an education AI system as compliant?',a:'No. TA-14 can preserve the classification basis, prohibited-practice analysis, evidence, human-oversight state, gaps, decision history and revalidation record. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function EducationAdmissionsTestingAssessmentAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · EDUCATION · ADMISSIONS · TESTING · ASSESSMENT"
  title="WHEN AI CAN SHAPE A STUDENT’S PATH,"
  accent="THE EDUCATION DECISION HAS TO STAY REVIEWABLE."
  intro="Education AI can determine who gets admitted, how students are placed, how learning outcomes are evaluated, what level of education they can access, and whether they are flagged during tests. Annex III treats these specified uses as high-risk, while Article 5 separately prohibits emotion inference in education institutions except for medical or safety reasons."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5 and Annex III, Education"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation classifies specified AI used for admission, placement, learning-outcome assessment, education-level decisions and test-behaviour monitoring as high-risk. Article 5 separately prohibits emotion inference in education institutions except for medical or safety reasons. Current Commission guidance places Annex III education high-risk rules on the 2 December 2027 timeline."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=education-admissions-testing-assessment-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
