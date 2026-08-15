import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Financial Services and Credit AI',
  description:'Understand when AI used for creditworthiness, lending, life or health insurance pricing, or access to essential services may be high-risk under the EU AI Act and what evidence should be preserved.',
  alternates:{canonical:'/eu-ai-act/financial-services'},
  keywords:['EU AI Act credit AI','EU AI Act financial services','AI creditworthiness high risk','AI lending compliance EU','AI insurance pricing EU AI Act','Annex III creditworthiness'],
  openGraph:{title:'EU AI Act Compliance for Financial Services and Credit AI | TA-14',description:'A governed guide to creditworthiness, essential-services, and insurance-related high-risk AI pathways.',url:'/eu-ai-act/financial-services',type:'website'}
};

const cards=[
  {title:'IS THE AI EVALUATING CREDITWORTHINESS OR CREDIT SCORE?',copy:'Annex III identifies AI systems intended to evaluate the creditworthiness of natural persons or establish their credit score as high-risk, subject to the Regulation’s exact exclusions and conditions.'},
  {title:'IS THE SYSTEM AFFECTING ACCESS TO ESSENTIAL PRIVATE SERVICES?',copy:'AI that materially influences access to services such as housing, electricity, telecommunications or other essential private services can sit in a sensitive governance pathway because the outcome can significantly affect a person’s livelihood.'},
  {title:'IS THE AI PRICING OR ASSESSING LIFE OR HEALTH INSURANCE RISK?',copy:'Annex III also identifies certain AI systems used for risk assessment and pricing in relation to natural persons for life and health insurance as high-risk.'},
  {title:'CAN YOU PROVE THE DECISION PATH, OVERSIGHT AND EVIDENCE?',copy:'Preserve system version, intended purpose, data sources, model inputs, decision role, human oversight, testing, bias and performance evidence, adverse-outcome handling, material changes and the records supporting the current classification.'},
];

const steps=[
  {title:'Separate financial use cases before classifying',copy:'Credit scoring, fraud detection, prudential capital calculations, underwriting, pricing, eligibility, customer service and portfolio analytics do not all sit on the same AI Act route. Classify the exact intended purpose.'},
  {title:'Determine whether Annex III or another high-risk route applies',copy:'Map the system against Article 6 and Annex III, while preserving any applicable exclusion, unresolved fact or regulatory boundary rather than treating all financial AI as automatically high-risk.'},
  {title:'Bind decision controls to evidence',copy:'Connect risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity and review evidence to the decisions the AI can influence.'},
  {title:'Revalidate after data, model or decision-policy changes',copy:'A model update, new dataset, changed cut-off, revised underwriting logic, new product, new customer segment or altered human-approval threshold can materially change the evidentiary basis for continued reliance.'},
];

const faqs=[
  {q:'Is AI used for credit scoring high-risk under the EU AI Act?',a:'Yes, certain AI systems intended to evaluate the creditworthiness of natural persons or establish their credit score are listed in Annex III as high-risk.'},
  {q:'Are all financial-services AI systems high-risk?',a:'No. Classification depends on intended purpose. The Regulation specifically distinguishes certain high-risk financial use cases and also notes exclusions, including AI systems provided for by Union law for detecting fraud in the offering of financial services and prudential purposes to calculate capital requirements.'},
  {q:'What about life and health insurance AI?',a:'Certain AI systems intended for risk assessment and pricing in relation to natural persons for life and health insurance are listed as high-risk in Annex III.'},
  {q:'Do financial institutions need a fundamental-rights impact assessment?',a:'Certain deployers of high-risk AI systems, including specified banking and insurance entities for relevant Annex III systems, are subject to Article 27 fundamental-rights impact-assessment requirements before putting the high-risk system into use.'},
  {q:'What evidence should be preserved for credit or financial AI?',a:'Organizations should preserve system identity and version, intended purpose, classification basis, data and model information, testing, human oversight, decision policies, logging, adverse-outcome processes, changes, limitations and the evidence supporting each material governance proposition.'},
  {q:'Does TA-14 certify a lending or insurance AI system as compliant?',a:'No. TA-14 can preserve the classification basis, evidence, gaps, review history and revalidation state. It does not itself provide legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function FinancialServicesPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · FINANCIAL SERVICES · CREDIT · INSURANCE"
  title="WHEN AI AFFECTS ACCESS TO MONEY,"
  accent="THE EVIDENCE HAS TO SURVIVE THE DECISION."
  intro="Credit, lending, insurance and access-to-service AI can move directly into Annex III high-risk territory. The business question is not simply whether AI is used—it is what decision the system influences, how consequential that decision is, and what evidence supports the current classification and control environment."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Annex III and Article 6"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation identifies certain AI systems used for creditworthiness evaluation, credit scoring, and life or health insurance risk assessment and pricing as high-risk. It also distinguishes some financial-services uses, including fraud-detection and prudential-capital purposes, from those high-risk categories."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=financial-services"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
