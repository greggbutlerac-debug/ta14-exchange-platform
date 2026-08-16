import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Biometric AI',
  description:'Understand prohibited and high-risk biometric AI pathways under the EU AI Act, including biometric identification, biometric categorisation, emotion recognition, evidence, authority, oversight, and revalidation.',
  alternates:{canonical:'/eu-ai-act/biometric-ai'},
  keywords:['EU AI Act biometric AI','biometric identification AI Act','biometric categorisation prohibited AI','emotion recognition AI Act','remote biometric identification EU','Annex III biometrics'],
  openGraph:{title:'EU AI Act Compliance for Biometric AI | TA-14',description:'A governed guide to prohibited and high-risk biometric AI pathways under the EU AI Act.',url:'/eu-ai-act/biometric-ai',type:'website'}
};

const cards=[
  {title:'IS THE SYSTEM IDENTIFYING, VERIFYING OR CATEGORISING PEOPLE?',copy:'The Act distinguishes biometric identification, biometric verification/authentication, and biometric categorisation. Those are not interchangeable labels, and the legal route can change substantially depending on which function the system actually performs.'},
  {title:'DOES A PROHIBITED-PRACTICE RULE APPLY?',copy:'Certain biometric uses are prohibited, including some sensitive-attribute categorisation, untargeted facial-image scraping to build or expand recognition databases, and emotion inference in workplaces or education except for medical or safety purposes.'},
  {title:'IS THE SYSTEM ON A HIGH-RISK BIOMETRIC ROUTE?',copy:'Certain remote biometric identification, biometric categorisation, and emotion-recognition systems can fall within Annex III high-risk categories where the use is not already prohibited and the Regulation’s scope conditions are met.'},
  {title:'CAN YOU PROVE AUTHORITY, PURPOSE AND OVERSIGHT?',copy:'Preserve the exact intended purpose, biometric function, data source, lawful authority, operator role, system version, access controls, human oversight, deployment context, exceptions relied on, and change history.'},
];

const steps=[
  {title:'Define the biometric function precisely',copy:'Separate one-to-one verification, one-to-many identification, remote identification, categorisation, and emotion recognition. Do not classify a system merely as “facial recognition” if its actual function is different.'},
  {title:'Test prohibited-practice rules before high-risk classification',copy:'A prohibited use should not be treated as merely a stricter compliance pathway. Establish whether Article 5 blocks the use before moving on to Annex III or other obligations.'},
  {title:'Bind authority and evidence to the deployment',copy:'Connect lawful basis, intended purpose, data provenance, human oversight, technical documentation, logging, access controls, performance, limitations and exception claims to the exact deployed system.'},
  {title:'Revalidate after purpose, dataset or deployment change',copy:'A new camera network, dataset, identification target, deployment environment, law-enforcement use, sensitive-category inference, or model change can materially alter the legal and evidentiary state.'},
];

const faqs=[
  {q:'Does the EU AI Act ban biometric AI?',a:'No. It prohibits certain biometric practices and places some other biometric systems on high-risk pathways. The correct answer depends on the function, intended purpose, deployment context, operator, and any specific exception in the Regulation.'},
  {q:'Is biometric verification the same as biometric identification?',a:'No. The Regulation distinguishes identification from verification/authentication. Verification generally confirms that a person is who they claim to be, while biometric identification compares biometric data against a reference database to establish identity.'},
  {q:'What biometric categorisation is prohibited?',a:'The Act prohibits certain biometric categorisation used to deduce or infer sensitive characteristics such as race, political opinions, trade-union membership, religious or philosophical beliefs, sex life, or sexual orientation, subject to the Regulation’s stated exceptions.'},
  {q:'What about emotion recognition?',a:'Emotion-recognition systems are treated differently depending on context. The Act prohibits their use to infer emotions in workplaces and education institutions except for medical or safety reasons, while other emotion-recognition uses can fall into high-risk or transparency pathways.'},
  {q:'Is real-time remote biometric identification in public spaces prohibited?',a:'For law-enforcement use, the Act generally prohibits real-time remote biometric identification in publicly accessible spaces, subject to narrowly defined exceptions, necessity conditions, authorisation, and safeguards.'},
  {q:'Does TA-14 certify a biometric AI system as compliant?',a:'No. TA-14 can preserve the system identity, function, authority basis, evidence, exceptions, gaps, review history, and revalidation state. It does not itself provide legal advice, conformity assessment, certification, or regulatory approval.'},
];

export default function BiometricAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · BIOMETRICS · IDENTIFICATION · CATEGORISATION"
  title="BIOMETRIC AI CAN CROSS FROM"
  accent="HIGH-RISK INTO PROHIBITED USE."
  intro="Biometric AI cannot be governed as one generic category. Identification, verification, categorisation, emotion recognition, and remote identification sit on different legal pathways. The first question is what the system actually does—and whether that use is allowed at all."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5, Article 6 and Annex III"
  sourceHref="https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en"
  sourceNote="The Regulation distinguishes biometric identification from verification, prohibits certain sensitive biometric categorisation and other biometric practices, and places specified biometric systems on high-risk pathways where the use is permitted and the relevant conditions are met."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=biometric-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
