import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Employee Monitoring and Workplace AI',
  description:'Understand EU AI Act obligations for employee monitoring, performance evaluation, task allocation, promotion and termination AI, including Annex III high-risk classification, prohibited workplace emotion inference, human oversight, evidence and revalidation.',
  alternates:{canonical:'/eu-ai-act/employee-monitoring-workplace-ai'},
  keywords:['EU AI Act employee monitoring','workplace AI compliance EU','AI performance monitoring high risk','AI worker management Annex III','AI task allocation employees','workplace emotion recognition prohibited'],
  openGraph:{title:'EU AI Act Compliance for Employee Monitoring and Workplace AI | TA-14',description:'A governed guide to high-risk workplace AI, employee monitoring, performance evaluation and prohibited emotion inference.',url:'/eu-ai-act/employee-monitoring-workplace-ai',type:'website'}
};

const cards=[
  {title:'IS AI MONITORING OR EVALUATING WORKER PERFORMANCE OR BEHAVIOUR?',copy:'Annex III lists AI intended to monitor and evaluate the performance and behaviour of persons in work-related contractual relationships as high-risk.'},
  {title:'IS AI ALLOCATING TASKS OR AFFECTING PROMOTION, TERMINATION OR WORK TERMS?',copy:'AI used to allocate tasks based on individual behaviour or personal traits, or to make decisions affecting work-related terms, promotion or termination, also sits on the Annex III employment high-risk route.'},
  {title:'IS THE SYSTEM INFERRING WORKER EMOTIONS?',copy:'Article 5 prohibits AI systems used to infer emotions of natural persons in the workplace, except where the system is intended for medical or safety reasons. A prohibited use cannot be fixed merely by adding high-risk controls.'},
  {title:'CAN YOU PROVE THE HUMAN DECISION AND WORKER-IMPACT PATH?',copy:'Preserve the system and model version, monitored signals, scoring or evaluation output, decision rules, human review, overrides, notices, complaints or challenges, logs, limitations, and the evidence supporting any consequential employment action.'},
];

const steps=[
  {title:'Define the workplace function precisely',copy:'Separate productivity analytics, scheduling, task allocation, safety monitoring, performance scoring, conduct monitoring, promotion support, termination support and purely administrative tools. Different functions can create different legal routes.'},
  {title:'Test prohibited practices before high-risk classification',copy:'If the system infers emotions from biometric data in the workplace, test the Article 5 prohibition first. Do not treat prohibited emotion inference as a normal Annex III deployment unless a valid medical or safety exception applies.'},
  {title:'Bind human oversight and worker-impact evidence to the decision',copy:'Connect monitored data, model output, human reviewer, employment authority, override, notice, challenge or grievance path, logs, performance and bias evidence, and the resulting work-related decision.'},
  {title:'Revalidate after model, policy, metric or workflow changes',copy:'A new scoring model, changed performance metric, broader monitoring scope, new sensor source, removed human checkpoint, changed task-allocation logic or expanded employment purpose can make the previous classification and evidence stale.'},
];

const faqs=[
  {q:'Is employee-monitoring AI high-risk under the EU AI Act?',a:'Certain systems are. Annex III includes AI intended to monitor and evaluate the performance and behaviour of persons in work-related contractual relationships, as well as specified systems used for task allocation and decisions affecting employment terms, promotion or termination.'},
  {q:'Is all workplace analytics automatically high-risk?',a:'No. The classification depends on intended purpose and whether the system falls within an Annex III use case or another high-risk route. Purely administrative or non-consequential tools may fall outside that category, but the actual function must be assessed.'},
  {q:'Can employers use AI to infer worker emotions?',a:'Article 5 prohibits workplace emotion inference, except where the system is intended for medical or safety reasons. That prohibition has applied since 2 February 2025.'},
  {q:'When do the Annex III employment high-risk rules apply?',a:'Current European Commission guidance states that high-risk rules for Annex III employment systems apply from 2 December 2027.'},
  {q:'What evidence should be preserved for workplace AI?',a:'Preserve system identity and version, intended purpose, provider and deployer roles, monitored inputs, scoring or evaluation outputs, human review, overrides, notices, logs, performance and bias evidence, complaints or challenges, material changes and revalidation history.'},
  {q:'Does TA-14 certify employee-monitoring or workplace AI as compliant?',a:'No. TA-14 can preserve the classification basis, prohibited-practice analysis, authority, evidence, worker-impact record, human-oversight state, gaps and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function EmployeeMonitoringWorkplaceAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · WORKPLACE AI · EMPLOYEE MONITORING · WORKER MANAGEMENT"
  title="WHEN AI WATCHES OR SCORES WORKERS,"
  accent="THE EMPLOYMENT DECISION HAS TO STAY REVIEWABLE."
  intro="Workplace AI can influence promotion, termination, task allocation, performance assessment and day-to-day worker treatment. Annex III treats specified worker-management and monitoring uses as high-risk, while Article 5 separately prohibits workplace emotion inference except for medical or safety reasons."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5 and Annex III, Employment"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Annex III lists specified AI used to affect employment terms, promotion, termination, task allocation, and monitoring or evaluation of worker performance and behaviour as high-risk. Article 5 prohibits workplace emotion inference except for medical or safety reasons. Current Commission guidance places Annex III employment high-risk rules on the 2 December 2027 timeline."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=employee-monitoring-workplace-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
