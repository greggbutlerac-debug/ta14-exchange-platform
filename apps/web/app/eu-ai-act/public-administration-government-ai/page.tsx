import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Public Administration and Government AI',
  description:'Understand EU AI Act obligations for public authorities and government deployers of AI, including high-risk classification, fundamental-rights impact assessments, public database registration, affected-person notices, human oversight and evidence.',
  alternates:{canonical:'/eu-ai-act/public-administration-government-ai'},
  keywords:['EU AI Act public administration AI','government AI compliance EU','public authority AI high risk','fundamental rights impact assessment AI Act','government AI database registration','public sector AI governance Europe'],
  openGraph:{title:'EU AI Act Compliance for Public Administration and Government AI | TA-14',description:'A governed guide to high-risk public-sector AI, FRIA, registration, human oversight, notices and evidence under the EU AI Act.',url:'/eu-ai-act/public-administration-government-ai',type:'website'}
};

const cards=[
  {title:'IS THE PUBLIC AUTHORITY USING AN ANNEX III HIGH-RISK SYSTEM?',copy:'Government use is not automatically high-risk. The system still has to fall within Article 6 or an Annex III use case, such as public benefits, employment, education, law enforcement, migration, justice or other listed domains.'},
  {title:'DOES A FUNDAMENTAL-RIGHTS IMPACT ASSESSMENT APPLY?',copy:'Before first use of most Annex III high-risk systems, deployers that are bodies governed by public law must carry out a fundamental-rights impact assessment. The assessment must address the use context, affected groups, risks, human oversight and mitigation measures.'},
  {title:'MUST THE DEPLOYMENT BE REGISTERED IN THE EU DATABASE?',copy:'Public authorities and entities acting on their behalf generally have registration duties for high-risk Annex III systems. The Regulation provides special treatment for certain critical-infrastructure, law-enforcement and migration records.'},
  {title:'CAN THE AFFECTED PERSON UNDERSTAND THAT AI HELPED SHAPE THE DECISION?',copy:'Where a high-risk system is used to make or assist decisions about natural persons, deployers may have information duties toward affected people. Preserve the notice, decision path, human review, authority, logs and any challenge or redress route.'},
];

const steps=[
  {title:'Classify the exact government use—not the agency label',copy:'Identify the system, intended purpose, provider and deployer roles, and whether it falls within Annex III or another Article 6 route. A public authority can use both high-risk and non-high-risk AI.'},
  {title:'Complete the FRIA and align it with other impact assessments',copy:'For covered public-law deployers, document the processes, period and frequency of use, affected persons and groups, specific fundamental-rights risks, human-oversight measures and risk-mitigation steps. Where relevant, coordinate this with the data-protection impact assessment.'},
  {title:'Bind registration, notice and human oversight to the deployment record',copy:'Preserve the EU-database registration state where required, the responsible public body, operator roles, instructions of use, human-oversight assignment, notices to affected persons, incident pathways and authority to intervene or stop use.'},
  {title:'Revalidate after policy, model, legal or service changes',copy:'A new model, changed statutory basis, broader population, new administrative decision, altered data source, changed threshold or expanded intended purpose can make the previous classification, FRIA and evidence stale.'},
];

const faqs=[
  {q:'Is all government AI high-risk under the EU AI Act?',a:'No. Public-sector use is not automatically high-risk. Classification still depends on Article 6 and the intended purpose of the system, including whether it falls within an Annex III use case.'},
  {q:'Do public authorities have to carry out a fundamental-rights impact assessment?',a:'For most Annex III high-risk systems, yes. Article 27 requires deployers that are bodies governed by public law to perform a fundamental-rights impact assessment before first use, subject to the Regulation’s stated exceptions.'},
  {q:'Do public authorities have to register high-risk AI systems?',a:'Public authorities and entities acting on their behalf generally have EU-database registration duties for Annex III high-risk systems. The Regulation provides special handling for certain critical-infrastructure, law-enforcement and migration deployments.'},
  {q:'Do people have to be told when government AI helps make a decision about them?',a:'The Commission’s current AI Act guidance states that if a high-risk AI system is designed to make or assist in making decisions about natural persons, the deployer must inform the affected person. Other transparency and sector-specific duties may also apply.'},
  {q:'What evidence should a government deployer preserve?',a:'Preserve system identity and version, intended purpose, classification basis, provider and deployer roles, statutory or administrative authority, FRIA, input-data governance, human-oversight assignment, notices, registration state, logs, incidents, complaints, changes and revalidation history.'},
  {q:'Does TA-14 certify a government AI deployment as lawful or compliant?',a:'No. TA-14 can preserve the classification basis, authority claim, FRIA evidence, notices, human oversight, registration state, gaps and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function PublicAdministrationGovernmentAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · PUBLIC ADMINISTRATION · GOVERNMENT AI · HIGH-RISK DEPLOYMENT"
  title="WHEN GOVERNMENT AI CAN AFFECT A PERSON,"
  accent="THE PUBLIC DECISION HAS TO STAY REVIEWABLE."
  intro="Public authorities can benefit from AI, but government deployment carries a distinct evidentiary burden when the system falls into a high-risk route. Classification, fundamental-rights impact assessment, registration, human oversight, affected-person notice and revalidation all need to remain connected to the actual administrative decision process."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 6, 26, 27, 49 and 71"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The AI Act does not classify all public-sector AI as high-risk. But when a public authority deploys an Annex III high-risk system, additional deployer duties can apply, including fundamental-rights impact assessment, human oversight, affected-person information and EU-database registration, with specific exceptions and restricted-access routes for certain sectors."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=public-administration-government-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
