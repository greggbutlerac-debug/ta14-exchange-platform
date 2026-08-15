import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Evidence Requirements for Businesses',
  description:'Understand what evidence, technical documentation, logs, instructions, risk records, oversight records, and change history organizations may need to preserve under the EU AI Act.',
  alternates:{canonical:'/eu-ai-act/evidence-requirements'},
  keywords:['EU AI Act evidence requirements','AI Act documentation requirements','AI Act technical documentation','AI Act logs','AI governance evidence','high-risk AI documentation'],
  openGraph:{title:'EU AI Act Evidence Requirements | TA-14',description:'A governed guide to technical documentation, logs, evidence continuity, human oversight, and change records under the EU AI Act.',url:'/eu-ai-act/evidence-requirements',type:'website'}
};

const cards=[
  {title:'WHAT FACTS SUPPORT THE CLASSIFICATION?',copy:'Preserve the system identity, intended purpose, operator role, applicable risk route, exclusions relied on, versions, dependencies, deployment context and the evidence supporting those facts.'},
  {title:'WHAT DOCUMENTATION SUPPORTS THE SYSTEM REQUIREMENTS?',copy:'For high-risk systems this can include technical documentation, risk-management records, data-governance evidence, testing, instructions for use, human-oversight measures, accuracy, robustness and cybersecurity evidence.'},
  {title:'WHAT OPERATIONAL RECORDS MUST SURVIVE OVER TIME?',copy:'Logs, monitoring records, incidents, corrective actions, post-market evidence, approved changes, declarations, notices and review history matter because the compliance position must survive beyond a one-time assessment.'},
  {title:'CAN YOU SHOW WHAT CHANGED AND WHAT WAS REVALIDATED?',copy:'Evidence is not durable if old files silently support a new system state. Preserve version changes, model swaps, intended-purpose changes, authority changes, source-state changes and the revalidation decision.'},
];

const steps=[
  {title:'Define the proposition before collecting files',copy:'Start with the claim being supported: system identity, actor role, classification, transparency duty, high-risk requirement, human oversight, or another obligation. A file is only useful if it supports a bounded proposition.'},
  {title:'Bind each evidence object to source, version, scope and owner',copy:'Preserve who produced the evidence, what system/version it concerns, when it was valid, what scope it covers, and which accountable person or authority relies on it.'},
  {title:'Separate supported, missing, stale and unresolved evidence',copy:'A governed record should show evidence gaps and stale evidence explicitly instead of allowing an incomplete folder to look complete.'},
  {title:'Revalidate after material change',copy:'When the system, intended purpose, model, authority, deployment, legal source or control environment changes, question whether the previous evidence can still be relied upon.'},
];

const faqs=[
  {q:'Does the EU AI Act require technical documentation?',a:'Yes for high-risk AI systems. Article 11 requires technical documentation to be drawn up before the system is placed on the market or put into service, kept up to date, and structured to demonstrate compliance with the high-risk requirements.'},
  {q:'What does high-risk technical documentation contain?',a:'Article 11 points to Annex IV. In practice, the documentation covers the system description, development process, monitoring and control, performance, risk-management measures, changes and other information needed to assess conformity.'},
  {q:'Does the EU AI Act require logs?',a:'High-risk AI systems must technically allow automatic logging over their lifetime under Article 12. Providers and deployers must keep logs under their control for an appropriate period, generally at least six months unless other law provides differently.'},
  {q:'How long must providers keep high-risk documentation?',a:'Article 18 requires providers to keep specified documentation available to competent authorities for 10 years after the high-risk AI system has been placed on the market or put into service.'},
  {q:'Is every EU AI Act evidence requirement the same for every company?',a:'No. The evidence set depends on the system, operator role, risk classification, intended purpose, sector, customer use, transparency duties and other applicable Union or national law.'},
  {q:'Does uploading documents to TA-14 prove compliance?',a:'No. TA-14 can preserve evidence identity, scope, provenance, gaps, change and revalidation state. The existence of a document—or its presence in a workspace—does not by itself establish legal compliance.'},
];

export default function EvidenceRequirementsPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · DOCUMENTATION · LOGS · EVIDENCE"
  title="WHAT DO YOU ACTUALLY NEED"
  accent="TO HAVE ON FILE?"
  intro="EU AI Act governance becomes real when a business can show the evidence behind its system identity, classification, obligations, controls, changes and continuing reliance. The goal is not a bigger document folder. It is a current, attributable evidence record."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 11, 12, 18 and 19"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="For high-risk AI systems, Article 11 requires technical documentation before market placement or use and requires it to be kept up to date. Article 12 requires automatic logging capability. Article 18 sets a 10-year provider documentation-retention period for specified records, while Article 19 generally requires controlled logs to be kept for at least six months unless other law provides otherwise."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=evidence"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE EVIDENCE WORKSPACE →"
/>}
