import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for SaaS Companies',
  description:'Understand how the EU AI Act can apply to SaaS vendors with embedded AI, API-based AI features, cloud AI services, or EU customers, including provider and deployer role questions.',
  alternates:{canonical:'/eu-ai-act/saas-companies'},
  keywords:['EU AI Act SaaS','AI SaaS compliance','EU AI Act software companies','AI provider EU SaaS','AI API compliance EU','embedded AI SaaS'],
  openGraph:{title:'EU AI Act Compliance for SaaS Companies | TA-14',description:'A governed guide for SaaS vendors offering AI features, APIs, and cloud services into the EU market.',url:'/eu-ai-act/saas-companies',type:'website'}
};

const cards=[
  {title:'ARE YOU THE PROVIDER OR JUST USING SOMEONE ELSE’S AI?',copy:'A SaaS company can become the provider of an AI system it develops or has developed and places on the market under its own name or trademark. Using a third-party model does not automatically eliminate provider responsibilities at the system level.'},
  {title:'IS THE AI FEATURE BEING MADE AVAILABLE IN THE EU?',copy:'The Act can apply when AI systems or models are placed on the Union market. Availability can occur through software, APIs, cloud services, integrations, or other commercial delivery paths.'},
  {title:'DO YOUR CUSTOMERS RELY ON YOUR SYSTEM FOR CONSEQUENTIAL USES?',copy:'A general SaaS feature can move into a more demanding governance route when customers use it for employment, credit, essential services, biometric, safety, transparency-sensitive, or other regulated purposes.'},
  {title:'WHAT DO YOU NEED TO PASS DOWN TO CUSTOMERS?',copy:'Preserve instructions, intended purpose, limitations, version history, change notices, technical information, transparency measures, human-oversight expectations, and other evidence customers need to use the system within a supportable boundary.'},
];

const steps=[
  {title:'Identify the commercial AI system boundary',copy:'Separate the underlying model, your SaaS application, embedded AI features, customer-configured workflows, and downstream use cases. Different layers can carry different roles and obligations.'},
  {title:'Determine your operator role and EU exposure',copy:'Establish whether you are acting as provider, deployer, importer, distributor, product manufacturer, GPAI provider, or another operator for each relevant layer. Preserve the facts supporting that role.'},
  {title:'Map customer-facing obligations to evidence',copy:'Connect transparency, technical documentation, instructions, logs, risk controls, system versions, human oversight, support boundaries, and change notices to the claims your SaaS business makes to customers.'},
  {title:'Revalidate when features, models, or use cases change',copy:'Model swaps, new autonomous features, expanded decision authority, new customer sectors, EU market entry, or changes in intended purpose can change both role and obligation state.'},
];

const faqs=[
  {q:'Does the EU AI Act apply to SaaS companies outside Europe?',a:'It can. Article 2 applies to providers placing AI systems or general-purpose AI models on the Union market regardless of whether the provider is established in the EU, and it can also apply where outputs from a third-country provider or deployer are used in the Union.'},
  {q:'If we use OpenAI or another third-party model, are we automatically only a deployer?',a:'No. Role depends on the actual system and how it is developed, branded, placed on the market, and used. A SaaS company can still be the provider of its own AI system even when that system incorporates a third-party model.'},
  {q:'Does offering an AI feature through an API or cloud service count as placing it on the market?',a:'The Commission’s current GPAI guidance expressly notes that first availability on the Union market can occur through APIs, downloads, cloud services, integrations into applications, or other means. System-level analysis should still be done separately from model-level analysis.'},
  {q:'What if our SaaS is low-risk?',a:'Low-risk does not mean “no obligations.” Depending on the system, provider/deployer role, transparency features, AI literacy duties, customer use, and other legal layers may still matter. The first step is classification, not assumption.'},
  {q:'What evidence should a SaaS vendor preserve?',a:'At minimum: system identity, version, intended purpose, operator role, model/provider dependencies, customer instructions, transparency measures, change history, limitations, testing, incident records, and the evidence supporting any classification or exclusion claim.'},
  {q:'Does TA-14 certify our SaaS platform as EU AI Act compliant?',a:'No. TA-14 can preserve role analysis, system identity, evidence, gaps, changes and revalidation history. It does not itself provide legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function SaasCompaniesPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · SAAS · CLOUD AI · EMBEDDED AI"
  title="SELLING AI FEATURES INTO EUROPE?"
  accent="KNOW YOUR ROLE BEFORE YOU SCALE."
  intro="SaaS companies often sit in the middle of the AI value chain: a third-party model underneath, your product and brand in the middle, and customer use cases downstream. The commercial risk is assuming that someone else’s model documentation answers your own system-level obligations."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 2 and 3"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation applies to providers placing AI systems or GPAI models on the Union market even when they are established outside the EU. Article 3 defines provider, deployer, importer, distributor, placing on the market, and making available on the market."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=saas"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="COMPARE GOVERNANCE WORKSPACES →"
/>}
