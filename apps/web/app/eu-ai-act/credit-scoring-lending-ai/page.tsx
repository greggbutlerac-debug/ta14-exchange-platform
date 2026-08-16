import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Credit Scoring and Lending AI',
  description:'Understand EU AI Act obligations for AI used to evaluate creditworthiness or establish credit scores, including Annex III high-risk classification, fraud-detection exclusions, human oversight, decision evidence, and revalidation.',
  alternates:{canonical:'/eu-ai-act/credit-scoring-lending-ai'},
  keywords:['EU AI Act credit scoring','AI lending compliance EU','creditworthiness AI high risk','Annex III credit score AI','AI mortgage compliance Europe','AI fraud detection EU AI Act'],
  openGraph:{title:'EU AI Act Compliance for Credit Scoring and Lending AI | TA-14',description:'A governed guide to high-risk creditworthiness and credit-scoring AI under the EU AI Act.',url:'/eu-ai-act/credit-scoring-lending-ai',type:'website'}
};

const cards=[
  {title:'IS THE SYSTEM EVALUATING CREDITWORTHINESS OR ESTABLISHING A CREDIT SCORE?',copy:'Annex III classifies AI intended to evaluate the creditworthiness of natural persons or establish their credit score as high-risk, including consumer lending and mortgage use cases.'},
  {title:'IS THE SYSTEM USED ONLY FOR FINANCIAL-FRAUD DETECTION?',copy:'Annex III expressly excludes AI systems used for the purpose of detecting financial fraud from this specific creditworthiness high-risk category. The exact intended purpose still matters, and other AI Act or sector rules may apply.'},
  {title:'DOES ARTICLE 6(3) CHANGE THE CLASSIFICATION?',copy:'An Annex III system may avoid high-risk status only in limited circumstances where it does not pose a significant risk or materially influence the decision. Profiling of natural persons remains high-risk, and any exclusion analysis must be documented.'},
  {title:'CAN YOU PROVE WHY CREDIT WAS OFFERED, PRICED, LIMITED OR DENIED?',copy:'Preserve the system and model version, credit-use case, input data, score or recommendation, human review, overrides, notices, adverse-outcome reasoning, logs, complaints, policy changes, and the evidence supporting continued reliance.'},
];

const steps=[
  {title:'Define the exact lending function',copy:'Separate affordability assessment, creditworthiness evaluation, credit scoring, pricing support, fraud detection, collections, marketing and purely administrative processing. These functions do not all sit on the same AI Act route.'},
  {title:'Classify the system and document the basis',copy:'Test Annex III point 5(b), Article 6(3), profiling, operator roles, and any other applicable product or sector obligations. Preserve the classification analysis before deployment or market placement.'},
  {title:'Bind human review and evidence to the credit decision',copy:'Connect data inputs, model output, decision rules, human reviewer, override, explanations or notices, logs, performance and bias evidence, complaint or challenge pathways, and the resulting lending outcome.'},
  {title:'Revalidate after model, policy, data or product changes',copy:'A new scorecard, changed lending policy, new data source, model update, broader product scope, removed human checkpoint or changed intended purpose can make the prior classification and evidence stale.'},
];

const faqs=[
  {q:'Is AI credit scoring high-risk under the EU AI Act?',a:'Yes, when the system is intended to evaluate the creditworthiness of natural persons or establish their credit score, subject to the Regulation’s classification rules and limited Article 6(3) derogation.'},
  {q:'Is AI fraud detection also high-risk under the same credit-scoring category?',a:'No. Annex III expressly excludes AI systems used for the purpose of detecting financial fraud from point 5(b). That does not mean every fraud-detection system is unregulated; it means this specific creditworthiness category does not apply on that basis alone.'},
  {q:'Can a credit-scoring system avoid high-risk classification under Article 6(3)?',a:'Potentially, but only if it does not pose a significant risk or materially influence the outcome and fits one of the listed conditions. Systems that perform profiling of natural persons remain high-risk, and providers relying on the derogation must document their assessment.'},
  {q:'When do these high-risk credit-scoring rules apply?',a:'Current European Commission guidance states that high-risk rules for Annex III systems apply from 2 December 2027.'},
  {q:'What evidence should be preserved for lending AI?',a:'Preserve system identity and version, intended purpose, provider and deployer roles, classification basis, data provenance, score or recommendation, human review, overrides, notices, logs, performance and bias evidence, complaints, material changes and revalidation history.'},
  {q:'Does TA-14 certify a lending or credit-scoring AI system as compliant?',a:'No. TA-14 can preserve the classification basis, evidence, human-oversight state, gaps, decision history and revalidation record. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function CreditScoringLendingAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · CREDIT SCORING · LENDING · HIGH-RISK AI"
  title="WHEN AI SHAPES ACCESS TO CREDIT,"
  accent="THE DECISION RECORD HAS TO SURVIVE THE SCORE."
  intro="Creditworthiness and credit-scoring AI can directly affect access to lending, mortgages and other essential private services. Annex III treats these uses as high-risk, while expressly separating fraud-detection systems from this specific category. The governance challenge is proving the classification, the evidence behind the decision, the human role, and the basis for continued reliance after change."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 6 and Annex III, Point 5(b)"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Annex III classifies AI used to evaluate the creditworthiness of natural persons or establish their credit score as high-risk, while excluding systems used for financial-fraud detection from that specific category. Article 6(3) provides a limited derogation, but profiling remains high-risk and the provider must document any reliance on the derogation."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=credit-scoring-lending-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
