import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Insurance AI',
  description:'Understand when insurance AI may be high-risk under the EU AI Act, including life and health risk assessment and pricing, fundamental-rights impact assessment, evidence, human oversight, and revalidation.',
  alternates:{canonical:'/eu-ai-act/insurance-ai'},
  keywords:['EU AI Act insurance AI','AI insurance compliance EU','life insurance AI high risk','health insurance AI high risk','Annex III insurance AI','AI underwriting compliance Europe'],
  openGraph:{title:'EU AI Act Compliance for Insurance AI | TA-14',description:'A governed guide to life and health insurance AI, high-risk classification, evidence, oversight, and revalidation.',url:'/eu-ai-act/insurance-ai',type:'website'}
};

const cards=[
  {title:'IS THE AI ASSESSING RISK OR PRICING LIFE OR HEALTH INSURANCE?',copy:'Annex III identifies certain AI systems intended for risk assessment and pricing in relation to natural persons for life and health insurance as high-risk. The intended purpose and actual decision role matter.'},
  {title:'IS THE SYSTEM DOING SOMETHING ELSE IN INSURANCE?',copy:'Claims triage, fraud detection, customer service, document extraction, marketing, underwriting support and portfolio analytics do not automatically sit on the same high-risk route. Classify the exact use case before assuming the obligation set.'},
  {title:'DOES A FUNDAMENTAL-RIGHTS IMPACT ASSESSMENT APPLY?',copy:'Certain deployers of high-risk AI used for life and health insurance risk assessment or pricing must carry out a fundamental-rights impact assessment before putting the system into use and notify the relevant national authority of the results.'},
  {title:'CAN YOU PROVE THE PRICING, OVERSIGHT AND CHANGE RECORD?',copy:'Preserve intended purpose, system version, data sources, model inputs, pricing or risk logic, testing, human oversight, limitations, adverse-outcome handling, changes, and the evidence supporting continued reliance.'},
];

const steps=[
  {title:'Separate the insurance use case',copy:'Do not classify “insurance AI” as one category. Separate pricing, risk assessment, underwriting support, fraud detection, claims handling, customer service, and portfolio functions because different routes can apply.'},
  {title:'Determine whether Annex III high-risk classification applies',copy:'Map the intended purpose against Article 6 and Annex III, preserving any unresolved fact, applicable boundary or claimed exclusion rather than forcing a categorical answer too early.'},
  {title:'Bind controls to the consequential decision path',copy:'Connect risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity, and impact-assessment evidence to the decisions the system can influence.'},
  {title:'Revalidate after model, data or pricing-policy changes',copy:'A changed model, dataset, pricing threshold, underwriting policy, customer segment, product, or human-approval boundary can make the prior evidence and classification stale.'},
];

const faqs=[
  {q:'Is insurance AI high-risk under the EU AI Act?',a:'Certain insurance AI systems are. Annex III specifically identifies systems intended for risk assessment and pricing in relation to natural persons for life and health insurance as high-risk.'},
  {q:'Are all insurance AI systems high-risk?',a:'No. The current high-risk financial-services category is specifically focused on certain life and health insurance risk-assessment and pricing uses. Other insurance uses still need classification, but they are not automatically high-risk merely because they are used by an insurer.'},
  {q:'Does life or health insurance AI require a fundamental-rights impact assessment?',a:'Certain deployers of these high-risk systems must perform an Article 27 fundamental-rights impact assessment before use and notify the relevant national authority of the results.'},
  {q:'What evidence should insurers preserve?',a:'Organizations should preserve system identity and version, intended purpose, classification basis, data and model information, testing, pricing or risk logic, human oversight, impact-assessment records, logs, changes, limitations, and the evidence supporting each material governance proposition.'},
  {q:'What happens if the insurer changes the model or pricing logic?',a:'That should trigger revalidation. A material change can affect the classification basis, performance evidence, fairness assumptions, oversight design, or whether previous documentation can still be relied upon.'},
  {q:'Does TA-14 certify an insurance AI system as compliant?',a:'No. TA-14 can preserve the classification basis, evidence, gaps, impact-assessment record, review history, and revalidation state. It does not itself provide legal advice, conformity assessment, certification, or regulatory approval.'},
];

export default function InsuranceAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · INSURANCE · LIFE & HEALTH · HIGH-RISK AI"
  title="WHEN AI SETS OR SHAPES INSURANCE RISK,"
  accent="THE RECORD HAS TO SURVIVE THE PRICE."
  intro="Insurance AI can move from ordinary automation into Annex III high-risk territory when it assesses risk or prices life and health insurance for natural persons. The governance problem is not merely whether the model is accurate—it is whether the classification, evidence, oversight, impact assessment, and current system state can support the decision being made."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Annex III and Article 27"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="The Regulation identifies certain AI systems used for risk assessment and pricing in relation to natural persons for life and health insurance as high-risk. Current Commission guidance also confirms that relevant operators using these high-risk systems are among those subject to fundamental-rights impact-assessment duties before deployment."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=insurance-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
