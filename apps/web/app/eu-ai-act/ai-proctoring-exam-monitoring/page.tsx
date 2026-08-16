import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for AI Proctoring and Exam Monitoring',
  description:'Understand EU AI Act obligations for AI proctoring and exam monitoring, including Annex III high-risk test-behaviour monitoring, prohibited emotion recognition, human review, false-positive handling, logging, appeals and revalidation.',
  alternates:{canonical:'/eu-ai-act/ai-proctoring-exam-monitoring'},
  keywords:['EU AI Act AI proctoring','AI exam monitoring compliance EU','student monitoring high risk AI','AI test behaviour Annex III','remote proctoring EU AI Act','AI proctoring emotion recognition'],
  openGraph:{title:'EU AI Act Compliance for AI Proctoring and Exam Monitoring | TA-14',description:'A governed guide to high-risk AI proctoring, test monitoring, human review and prohibited emotion inference under the EU AI Act.',url:'/eu-ai-act/ai-proctoring-exam-monitoring',type:'website'}
};

const cards=[
  {title:'IS AI MONITORING OR DETECTING PROHIBITED BEHAVIOUR DURING A TEST?',copy:'Annex III includes AI intended to monitor and detect prohibited behaviour of students during tests as a high-risk education use. Remote or in-person proctoring can therefore enter the high-risk route when the system materially flags or influences academic misconduct decisions.'},
  {title:'IS THE SYSTEM INFERRING EMOTIONS?',copy:'Article 5 separately prohibits AI used to infer emotions of natural persons in education institutions, except where the system is intended for medical or safety reasons. A proctoring system should be screened for emotion-recognition features before any high-risk compliance analysis.'},
  {title:'CAN A HUMAN REVIEW A FLAG BEFORE CONSEQUENCE ATTACHES?',copy:'High-risk AI requires effective human oversight. A suspicious-behaviour flag should not silently become an academic penalty without a reviewable path that allows a competent human to understand limitations, examine evidence and disregard or reverse the output where appropriate.'},
  {title:'CAN YOU RECONSTRUCT THE FLAG, REVIEW AND APPEAL?',copy:'Preserve the system and model version, monitored signals, trigger or score, captured evidence, human reviewer, override, notice, academic-integrity decision, appeal or challenge, logs, limitations and the basis for the final outcome.'},
];

const steps=[
  {title:'Define what the proctoring system actually detects',copy:'Separate identity verification, browser or device monitoring, gaze or movement analysis, audio monitoring, object detection, behaviour scoring, anomaly detection and misconduct classification. The real function determines the legal route.'},
  {title:'Test prohibited practices before high-risk controls',copy:'If the system infers emotions in an education setting, assess Article 5 first. Prohibited emotion inference cannot be made acceptable merely through better notices, logging or human review.'},
  {title:'Bind every consequential flag to human review and evidence',copy:'Connect the detected event, underlying evidence, system confidence or score, reviewer, decision authority, override, notice, appeal route and final academic outcome so a false positive can be challenged and corrected.'},
  {title:'Revalidate after model, sensor, rule or exam changes',copy:'A new model, changed detection threshold, new sensor, different exam format, broader monitoring scope, removed human checkpoint or new misconduct rule can make the prior classification and evidence stale.'},
];

const faqs=[
  {q:'Is AI proctoring high-risk under the EU AI Act?',a:'It can be. Annex III lists AI used to monitor and detect prohibited behaviour of students during tests as a high-risk education use. The exact intended purpose and degree of influence still matter.'},
  {q:'Is all remote proctoring automatically high-risk?',a:'No. The classification depends on what the system does. Simple video transport or administrative scheduling differs from AI that detects, scores or flags student behaviour for possible misconduct.'},
  {q:'Can AI proctoring use emotion recognition?',a:'Article 5 prohibits emotion inference in education institutions except where the system is intended for medical or safety reasons. That prohibition applies separately from the Annex III high-risk route.'},
  {q:'Should an AI-generated misconduct flag automatically fail a student?',a:'A high-risk system must support effective human oversight. The responsible human should be able to examine the evidence, understand relevant limitations, avoid over-reliance on the model, and disregard or reverse the output where appropriate.'},
  {q:'When do the Annex III education high-risk rules apply?',a:'Current European Commission guidance states that rules for Annex III education systems apply from 2 December 2027.'},
  {q:'What evidence should be preserved for AI proctoring?',a:'Preserve system identity and version, intended purpose, monitored signals, detection rules or scores, relevant captured evidence, human review, overrides, notices, logs, performance and false-positive evidence, appeals or challenges, material changes and revalidation history.'},
  {q:'Does TA-14 certify an AI proctoring system as compliant?',a:'No. TA-14 can preserve the classification basis, prohibited-practice analysis, review evidence, human-oversight state, gaps, appeal history and revalidation record. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function AiProctoringExamMonitoringPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · AI PROCTORING · EXAM MONITORING · STUDENT FLAGS"
  title="WHEN AI CAN FLAG A STUDENT FOR MISCONDUCT,"
  accent="THE FLAG CANNOT BECOME THE VERDICT."
  intro="AI proctoring can turn gaze, movement, sound, browser activity or other signals into suspicion of prohibited test behaviour. Under Annex III, systems used to monitor and detect prohibited behaviour of students during tests can be high-risk. The governance burden is preserving the evidence, human review and appeal path between an automated flag and any academic consequence."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5 and Annex III, Education"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation classifies specified AI used to monitor and detect prohibited behaviour of students during tests as high-risk. Article 5 separately prohibits emotion inference in education institutions except for medical or safety reasons. Current Commission guidance places Annex III education high-risk rules on the 2 December 2027 timeline."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=ai-proctoring-exam-monitoring"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
