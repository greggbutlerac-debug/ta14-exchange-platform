import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Migration, Asylum and Border-Control AI',
  description:'Understand high-risk AI pathways for migration, asylum, visa and border-control systems under the EU AI Act, including risk assessment, evidence evaluation, identification, authority, human oversight and deployment records.',
  alternates:{canonical:'/eu-ai-act/migration-asylum-border-ai'},
  keywords:['EU AI Act migration AI','EU AI Act asylum AI','border control AI compliance','visa AI high risk','Annex III migration AI','AI asylum decision EU'],
  openGraph:{title:'EU AI Act Compliance for Migration, Asylum and Border-Control AI | TA-14',description:'A governed guide to Annex III migration, asylum, visa and border-control AI pathways.',url:'/eu-ai-act/migration-asylum-border-ai',type:'website'}
};

const cards=[
  {title:'IS THE SYSTEM ASSESSING MIGRATION, VISA OR ASYLUM RISK?',copy:'Annex III identifies certain AI systems used by or on behalf of competent public authorities to assess risks posed by people entering a Member State or applying for visa or asylum as high-risk.'},
  {title:'IS AI HELPING EXAMINE AN APPLICATION OR EVIDENCE?',copy:'High-risk routes can include systems assisting public authorities with asylum, visa and residence-permit applications and related complaints, including assessment of the reliability of evidence used to establish eligibility.'},
  {title:'IS THE SYSTEM DETECTING OR IDENTIFYING PEOPLE?',copy:'Annex III also covers certain AI used in migration, asylum or border-control management to detect, recognise or identify natural persons, while expressly distinguishing verification of travel documents.'},
  {title:'CAN YOU PROVE AUTHORITY, PURPOSE AND HUMAN CONTROL?',copy:'Preserve the legal authority, exact administrative purpose, system version, data sources, evidence inputs, human decision role, review and appeal path, access controls, logs, limitations, and the basis for continued deployment.'},
];

const steps=[
  {title:'Classify the exact administrative function',copy:'Separate risk assessment, application examination, evidence-reliability support, identity detection, border screening, travel-document verification and other uses. Do not classify the whole migration workflow as one AI system.'},
  {title:'Confirm that the use is permitted under applicable law',copy:'The AI Act does not replace visa, asylum, migration, border-control, data-protection or procedural law. Establish the underlying authority and procedural route before treating the AI layer as deployable.'},
  {title:'Bind evidence and human judgment to the decision path',copy:'Connect the system’s inputs, documentation, logs, limitations, human review, procedural safeguards, appeal or complaint pathway, and other controls to the consequential administrative determination.'},
  {title:'Revalidate after policy, model, data or legal-source changes',copy:'A changed eligibility rule, model, dataset, border workflow, identification function, authority basis, procedural safeguard or legal source can materially change whether the prior classification and evidence remain reliable.'},
];

const faqs=[
  {q:'Which migration and asylum AI systems are high-risk?',a:'Annex III includes specified systems used by or on behalf of competent public authorities for migration, asylum and border-control management, including certain polygraph-like tools, risk assessment, examination of asylum/visa/residence applications, evidence-reliability support, and detecting or identifying natural persons.'},
  {q:'Is travel-document verification automatically high-risk?',a:'Annex III expressly distinguishes verification of travel documents from the listed high-risk detection, recognition and identification route. The exact function and surrounding system still need to be classified.'},
  {q:'Can AI make the final asylum or visa decision?',a:'The AI Act does not itself grant decision authority. Any use must remain consistent with applicable Union and national procedural law, and high-risk deployment requires human-oversight and other controls appropriate to the system and context.'},
  {q:'When do these Annex III high-risk rules apply?',a:'Current Commission guidance states that rules for systems in Annex III areas including migration, asylum and border control apply from 2 December 2027.'},
  {q:'What evidence should be preserved?',a:'Preserve system identity and version, intended purpose, legal authority, operator role, decision scope, data provenance, evidence inputs, human review, procedural safeguards, logs, technical documentation, limitations, changes, and the basis for continued reliance.'},
  {q:'Does TA-14 determine whether an asylum or border deployment is legally authorised?',a:'No. TA-14 can preserve the authority claim, classification basis, evidence, scope, gaps, review history and revalidation state. It does not itself provide legal authorisation, legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function MigrationAsylumBorderAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · MIGRATION · ASYLUM · BORDER CONTROL"
  title="WHEN AI SHAPES ENTRY OR STATUS,"
  accent="THE DECISION RECORD HAS TO SURVIVE REVIEW."
  intro="Migration, asylum, visa and border-control AI can sit directly inside Annex III high-risk pathways. The central governance question is not simply whether AI assisted the process, but what function it performed, what authority supported that use, what evidence reached the decision, and whether human and procedural safeguards remained real."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Annex III, Point 7"
  sourceHref="https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en"
  sourceNote="The Regulation classifies specified migration, asylum and border-control AI uses as high-risk where permitted by applicable law, including certain risk assessments, application and evidence examination, and detection or identification of natural persons. Current Commission guidance states that these Annex III high-risk rules apply from 2 December 2027."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=migration-asylum-border-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
