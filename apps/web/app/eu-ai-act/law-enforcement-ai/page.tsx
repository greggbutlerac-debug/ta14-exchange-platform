import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Law Enforcement AI',
  description:'Understand prohibited and high-risk law-enforcement AI pathways under the EU AI Act, including criminal-risk prediction, biometric identification, evidence evaluation, profiling, authority, oversight, and deployment records.',
  alternates:{canonical:'/eu-ai-act/law-enforcement-ai'},
  keywords:['EU AI Act law enforcement AI','police AI compliance Europe','criminal risk AI Act','law enforcement high risk AI','biometric law enforcement AI','Annex III law enforcement AI'],
  openGraph:{title:'EU AI Act Compliance for Law Enforcement AI | TA-14',description:'A governed guide to prohibited and high-risk law-enforcement AI pathways under the EU AI Act.',url:'/eu-ai-act/law-enforcement-ai',type:'website'}
};

const cards=[
  {title:'IS THE USE PROHIBITED BEFORE YOU EVEN REACH HIGH-RISK?',copy:'Article 5 prohibits certain law-enforcement uses, including criminal-risk assessment based solely on profiling or personality traits, subject to the Regulation’s narrow distinction for human assessment already grounded in objective and verifiable facts.'},
  {title:'IS THE SYSTEM ON AN ANNEX III LAW-ENFORCEMENT ROUTE?',copy:'Annex III includes specified law-enforcement uses such as victim-risk assessment, polygraph or similar tools, evaluation of evidence reliability, certain offending or reoffending assessments, and profiling during detection, investigation or prosecution.'},
  {title:'DO BIOMETRIC IDENTIFICATION RULES APPLY?',copy:'Real-time remote biometric identification in publicly accessible spaces for law enforcement is generally prohibited, with tightly bounded exceptions requiring necessity, safeguards and authorisation conditions.'},
  {title:'CAN YOU PROVE AUTHORITY, NECESSITY AND DEPLOYMENT SCOPE?',copy:'Preserve the legal authority, operational purpose, case or deployment scope, system version, data sources, human decision role, approval path, logs, oversight, exception relied on, and evidence that use stayed within the declared boundary.'},
];

const steps=[
  {title:'Test Article 5 prohibitions first',copy:'Do not treat a prohibited practice as simply a higher compliance tier. Determine whether the intended law-enforcement use is allowed before moving into Annex III or other operational requirements.'},
  {title:'Classify the exact law-enforcement function',copy:'Separate victim-risk assessment, evidence evaluation, profiling, biometric identification, polygraph-like functions, offending-risk assessment, and other uses. Each function can sit on a different legal route.'},
  {title:'Bind authority and human judgment to evidence',copy:'Connect legal authority, necessity, proportionality, objective case facts, human review, logging, technical documentation, access controls, performance limits and approval evidence to the exact deployment.'},
  {title:'Revalidate whenever purpose, facts or authority change',copy:'A new investigation type, jurisdiction, target population, model, dataset, biometric capability, profiling purpose, approval basis or legal source can materially change whether the prior deployment remains governable.'},
];

const faqs=[
  {q:'Does the EU AI Act prohibit predictive policing?',a:'It prohibits AI systems used to assess or predict a natural person’s risk of committing a criminal offence when that assessment is based solely on profiling or on personality traits and characteristics. The Regulation distinguishes this from AI used to support a human assessment already based on objective and verifiable facts directly linked to criminal activity.'},
  {q:'Which law-enforcement AI systems are high-risk?',a:'Annex III lists specified law-enforcement uses, including systems for assessing a person’s risk of becoming a crime victim, polygraph or similar tools, evaluating evidence reliability, certain offending or reoffending assessments not solely based on profiling, and profiling during criminal detection, investigation or prosecution.'},
  {q:'Is real-time facial recognition by police allowed?',a:'Real-time remote biometric identification in publicly accessible spaces for law-enforcement purposes is generally prohibited, subject to narrowly defined exceptions and strict necessity, safeguard and authorisation conditions.'},
  {q:'Do law-enforcement high-risk systems require the same controls as other high-risk AI?',a:'The high-risk framework still matters, but law-enforcement systems also operate inside additional Union and Member State legal constraints, including rules on personal-data processing, criminal procedure, necessity, proportionality and competent authority.'},
  {q:'What evidence should be preserved?',a:'Preserve system identity and version, intended purpose, legal authority, case or deployment scope, objective facts relied on, data provenance, human decision role, approvals, logs, technical evidence, limitations, exceptions, changes and the basis for continued reliance.'},
  {q:'Does TA-14 determine that a police AI deployment is legally authorised?',a:'No. TA-14 can preserve the authority claim, classification basis, evidence, scope, gaps, review history and revalidation state. It does not itself provide legal authorisation, legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function LawEnforcementAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · LAW ENFORCEMENT · HIGH-RISK · PROHIBITED USE"
  title="BEFORE LAW-ENFORCEMENT AI ACTS,"
  accent="THE AUTHORITY AND EVIDENCE HAVE TO HOLD."
  intro="Law-enforcement AI sits at one of the Act’s strictest boundaries. Some uses are prohibited, others are high-risk, and biometric deployment can trigger additional necessity and authorisation conditions. The governance question is not only whether the model performs—it is whether the use remained legally and evidentially bounded at the moment of consequence."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5, Article 6 and Annex III"
  sourceHref="https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en"
  sourceNote="The Regulation prohibits certain criminal-risk assessments and tightly restricts real-time remote biometric identification for law-enforcement purposes, while Annex III places specified law-enforcement systems on high-risk pathways. Biometric and other personal-data processing remains subject to additional Union and Member State law."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=law-enforcement-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
