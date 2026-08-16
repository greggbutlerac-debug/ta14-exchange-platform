import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for AI Vendors and Procurement',
  description:'A practical EU AI Act vendor due-diligence guide for buyers and suppliers: role allocation, evidence requests, high-risk system documentation, downstream information, contract handoffs, change notification and revalidation.',
  alternates:{canonical:'/eu-ai-act/vendor-procurement'},
  keywords:['EU AI Act vendor due diligence','AI procurement compliance EU','AI vendor risk assessment','AI supplier questionnaire EU AI Act','Article 25 AI value chain','AI contract due diligence'],
  openGraph:{title:'EU AI Act Compliance for AI Vendors and Procurement | TA-14',description:'A governed approach to AI vendor due diligence, role allocation, evidence handoffs and change control under the EU AI Act.',url:'/eu-ai-act/vendor-procurement',type:'website'}
};

const cards=[
  {title:'WHO IS THE PROVIDER, DEPLOYER, IMPORTER OR DISTRIBUTOR?',copy:'Vendor due diligence starts with role clarity. EU AI Act duties differ across providers, deployers, importers and distributors, and contractual labels do not necessarily override the role created by the actual facts.'},
  {title:'COULD A BUYER BECOME THE PROVIDER?',copy:'Article 25 can shift provider obligations to a distributor, importer, deployer or other third party that rebrands a high-risk system, makes a substantial modification, or changes its intended purpose so it becomes high-risk.'},
  {title:'CAN THE VENDOR SUPPLY THE EVIDENCE THE BUYER NEEDS?',copy:'For high-risk AI, procurement should capture the documentation, instructions, conformity materials, performance limits, logging capabilities, human-oversight design, known risks, incident pathways and change information needed for lawful deployment.'},
  {title:'WILL THE EVIDENCE SURVIVE A VENDOR OR MODEL CHANGE?',copy:'A new model, subprocessor, training source, API version, intended purpose, control threshold or product release can invalidate the prior due-diligence record. Contracts and operating procedures should preserve notification and revalidation pathways.'},
];

const steps=[
  {title:'Identify the exact AI system and each operator role',copy:'Do not procure “AI” generically. Record the system, model dependencies, intended purpose, deployment context, seller, provider, importer, distributor, deployer and any downstream or upstream actor whose evidence matters.'},
  {title:'Request obligation-linked evidence—not a generic security packet',copy:'Map the system’s likely obligations to specific evidence: classification basis, instructions, technical documentation, conformity information, logs, oversight controls, risk information, Article 50 disclosures where relevant, and GPAI documentation where a model sits upstream.'},
  {title:'Allocate responsibilities and change duties in writing',copy:'Preserve who must provide what evidence, who owns incident escalation, who may modify the system, what changes require notice, what support is required for audits or authority requests, and what happens if evidence becomes stale or unavailable.'},
  {title:'Revalidate before renewal, expansion or material change',copy:'Treat a major release, new use case, new jurisdiction, changed model, substantial modification, new data flow or changed intended purpose as a trigger to revisit the role, classification and evidence state.'},
];

const faqs=[
  {q:'Does the EU AI Act require vendor due diligence?',a:'The Act does not create one universal procurement checklist, but its role-based obligations make vendor evidence critical. Deployers of high-risk AI must use systems in accordance with instructions, assign competent human oversight, monitor operation, and report certain risks and serious incidents; importers and distributors also have verification and cooperation duties.'},
  {q:'Can a customer become the provider of a high-risk AI system?',a:'Yes. Under Article 25, a deployer or other third party can become the provider if it places its name or trademark on the system, makes a substantial modification while it remains high-risk, or changes the intended purpose so the system becomes high-risk.'},
  {q:'What should buyers ask an AI vendor for?',a:'At minimum, buyers should request enough information to identify the system and provider, classify the intended use, understand capabilities and limitations, implement required human oversight, preserve logs and records, manage incidents, and determine what changes require revalidation. High-risk and GPAI systems can require additional documentation.'},
  {q:'What should AI vendors provide to downstream customers?',a:'The exact duty depends on role and system type. High-risk system providers must supply instructions and other required conformity information. GPAI model providers must provide downstream AI-system providers with information and documentation sufficient to understand model capabilities and limitations and support downstream compliance.'},
  {q:'Should procurement contracts include model-change notification?',a:'Yes as an operational control, even where the Act does not prescribe one universal contract clause. Material model, system, intended-purpose or control changes can alter classification, performance assumptions or legal obligations, so notification and revalidation rights are important evidence-governance mechanisms.'},
  {q:'Does TA-14 certify an AI vendor or procurement decision as compliant?',a:'No. TA-14 can preserve role analysis, due-diligence evidence, supplier claims, gaps, contract-control state, changes and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function VendorProcurementPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · AI VENDORS · PROCUREMENT · DUE DILIGENCE"
  title="DON’T BUY AN AI SYSTEM"
  accent="WITHOUT BUYING THE EVIDENCE WITH IT."
  intro="AI procurement is now a governance event. A vendor can sell software, but the buyer still needs enough durable evidence to classify the system, understand who holds which role, implement the required controls, detect when the system changes, and prove why continued use remains justified."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Articles 23–26 and AI Value-Chain Responsibilities"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The AI Act assigns distinct duties to importers, distributors and deployers of high-risk AI systems, and Article 25 can shift provider obligations to another actor after rebranding, substantial modification or a changed intended purpose. GPAI providers also have documentation duties toward downstream AI-system providers."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=vendor-procurement"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE VENDOR EVIDENCE RECORD →"
/>}
