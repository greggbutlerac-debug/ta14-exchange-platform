import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for AI Hiring Interviews and Candidate Screening',
  description:'Understand EU AI Act obligations for AI used in recruitment, candidate screening, interview evaluation, ranking and employment decisions, including Annex III high-risk classification, prohibited emotion inference, human oversight and evidence.',
  alternates:{canonical:'/eu-ai-act/hiring-interviews-candidate-screening'},
  keywords:['EU AI Act AI hiring','AI recruitment compliance EU','AI candidate screening high risk','AI interview compliance Europe','Annex III recruitment AI','AI hiring emotion recognition prohibited'],
  openGraph:{title:'EU AI Act Compliance for AI Hiring Interviews and Candidate Screening | TA-14',description:'A governed guide to high-risk recruitment AI, candidate screening, interview analysis and prohibited emotion inference under the EU AI Act.',url:'/eu-ai-act/hiring-interviews-candidate-screening',type:'website'}
};

const cards=[
  {title:'IS AI PLACING JOB ADS, FILTERING APPLICATIONS OR EVALUATING CANDIDATES?',copy:'Annex III treats specified employment and recruitment systems as high-risk, including systems used to place targeted job advertisements, analyse or filter job applications, and evaluate candidates.'},
  {title:'IS THE INTERVIEW TOOL INFERRING EMOTIONS?',copy:'Article 5 prohibits AI systems used to infer emotions of natural persons in the workplace, except for medical or safety reasons. A hiring or interview context should therefore be screened for prohibited emotion-recognition features before high-risk controls are considered.'},
  {title:'CAN A HUMAN REVIEW AND OVERRIDE THE OUTPUT?',copy:'High-risk recruitment AI requires effective human oversight. Preserve who reviews recommendations, what information they receive, when they can disregard or reverse outputs, and how the final employment decision remains attributable.'},
  {title:'CAN YOU RECONSTRUCT WHY A CANDIDATE WAS ADVANCED OR REJECTED?',copy:'Preserve system and model version, intended purpose, application inputs, scoring or ranking outputs, interview data, human review, overrides, decision criteria, notices, complaints or challenges, and the evidence supporting the final decision.'},
];

const steps=[
  {title:'Define the exact recruitment function',copy:'Separate sourcing, targeted advertising, CV screening, ranking, interview transcription, interview scoring, skills assessment, background analysis, scheduling and final decision support. Not every recruiting tool performs the same regulated function.'},
  {title:'Test prohibited practices before high-risk classification',copy:'If the system infers emotions from biometric data in the workplace or recruitment process, test the Article 5 prohibition first. A prohibited use cannot be made permissible merely by adding high-risk controls.'},
  {title:'Bind human review and evidence to the candidate decision path',copy:'Connect input data, scoring logic, system output, human reviewer, decision authority, override, notices, challenge pathways, logs, bias or performance evidence and limitations to the consequential hiring outcome.'},
  {title:'Revalidate after model, criteria or workflow changes',copy:'A new scoring model, interview-analysis feature, changed job criteria, new data source, broader automation, removed human checkpoint or different employment use can make the previous classification and evidence stale.'},
];

const faqs=[
  {q:'Is AI used for recruitment high-risk under the EU AI Act?',a:'Certain recruitment systems are. Annex III identifies AI used for recruitment or selection, targeted job advertising, analysing and filtering job applications, and evaluating candidates as high-risk use cases.'},
  {q:'Are AI video interviews automatically prohibited?',a:'No. The legal route depends on what the system actually does. A video interview tool that records or transcribes may differ from a tool that scores candidates. If it infers emotions from biometric data in the workplace, Article 5 prohibits that use except for medical or safety reasons.'},
  {q:'Can employers rely entirely on an AI ranking?',a:'High-risk AI must be designed and used with effective human oversight. The responsible human should be able to understand relevant limitations, monitor the system, avoid automation bias, and disregard, override or reverse outputs where appropriate.'},
  {q:'When do the Annex III employment high-risk rules apply?',a:'Current European Commission guidance states that the high-risk rules for Annex III areas including employment apply from 2 December 2027.'},
  {q:'What evidence should be preserved for hiring AI?',a:'Preserve system identity and version, intended purpose, provider and deployer roles, job and candidate scope, inputs, scoring or ranking outputs, human review, overrides, notices, logs, performance and bias evidence, complaints, changes and revalidation history.'},
  {q:'Does TA-14 certify an AI hiring system as compliant?',a:'No. TA-14 can preserve the classification basis, prohibited-practice analysis, evidence, human-oversight state, gaps, decision history and revalidation record. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function HiringInterviewsCandidateScreeningPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · RECRUITMENT · CANDIDATE SCREENING · AI INTERVIEWS"
  title="WHEN AI HELPS CHOOSE WHO GETS THE JOB,"
  accent="THE DECISION HAS TO STAY HUMAN AND REVIEWABLE."
  intro="Recruitment AI can affect access to employment before a human decision-maker ever meets the candidate. Under Annex III, systems used to target job ads, filter applications or evaluate candidates can be high-risk. Interview tools add another boundary: if they infer emotions in the workplace, Article 5 can prohibit the use outright."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5 and Annex III, Employment"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation lists specified recruitment and candidate-evaluation uses as high-risk and prohibits workplace emotion inference except for medical or safety reasons. Current Commission guidance states that Annex III employment high-risk rules apply from 2 December 2027."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=hiring-interviews-candidate-screening"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
