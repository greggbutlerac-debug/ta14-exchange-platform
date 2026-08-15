import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act High-Risk AI Requirements for Businesses',
  description:'Understand Article 6 high-risk AI classification, Annex I and Annex III routes, key evidence requirements, and how to assess whether your AI system may be high-risk.',
  alternates:{canonical:'/eu-ai-act/high-risk-requirements'},
  keywords:['EU AI Act high-risk AI','Article 6 AI Act','Annex III AI Act','high-risk AI requirements','high-risk AI compliance','EU AI Act risk classification'],
  openGraph:{title:'EU AI Act High-Risk AI Requirements | TA-14',description:'A governed operating guide to Article 6, Annex I, Annex III and high-risk AI evidence requirements.',url:'/eu-ai-act/high-risk-requirements',type:'website'}
};

const cards=[
  {title:'DOES ARTICLE 6 PUT THE SYSTEM ON A HIGH-RISK ROUTE?',copy:'Check whether the AI is a safety component or regulated product under Annex I, or whether its intended use falls into an Annex III category. Do not assume “important” means high-risk or that “not dangerous” automatically means excluded.'},
  {title:'IS AN ARTICLE 6(3) EXCLUSION ACTUALLY SUPPORTABLE?',copy:'Some Annex III systems may not be high-risk if they do not pose a significant risk of harm and meet one of the listed conditions. The provider must document that assessment before market placement or putting into service.'},
  {title:'WHAT HIGH-RISK REQUIREMENTS APPLY TO THIS ACTOR?',copy:'Map the relevant duties to the actual role and system, including risk management, data governance, technical documentation, records, transparency, human oversight, accuracy, robustness and cybersecurity.'},
  {title:'WHAT EVIDENCE PROVES THE CURRENT POSITION?',copy:'Preserve the intended purpose, classification basis, versions, tests, risk controls, instructions, oversight design, performance evidence and any revalidation triggers. A label without the underlying record is fragile.'},
];

const steps=[
  {title:'Classify the route before building a compliance package',copy:'Establish the product context, Annex I or Annex III pathway, intended purpose, actor role and any claimed Article 6(3) exclusion before treating high-risk obligations as fixed.'},
  {title:'Bind each requirement to the evidence that supports it',copy:'Map risk-management records, testing, technical documentation, logs, instructions, human-oversight controls, accuracy, robustness and cybersecurity evidence to the specific proposition they support.'},
  {title:'Preserve unresolved and conditional states',copy:'If classification depends on missing facts, pending guidance, product integration or an unproven exclusion, keep the determination conditional rather than silently converting uncertainty into a compliance claim.'},
  {title:'Revalidate after material change',copy:'Changes to intended purpose, model, data, product integration, authority, deployment context or legal-source state can change classification or make prior evidence insufficient.'},
];

const faqs=[
  {q:'What makes an AI system high-risk under the EU AI Act?',a:'Article 6 establishes two principal routes: certain AI systems tied to regulated products under Annex I, and systems listed in Annex III. The exact classification depends on intended purpose and the conditions in Article 6.'},
  {q:'Are all Annex III systems automatically high-risk?',a:'Not always. Article 6(3) provides a limited route for some Annex III systems not to be treated as high-risk where they do not pose a significant risk of harm and one of the listed conditions applies. Profiling systems in Annex III remain high-risk.'},
  {q:'If we say our Annex III system is not high-risk, do we need documentation?',a:'Yes. Article 6(4) requires a provider relying on the Article 6(3) route to document the assessment before placing the system on the market or putting it into service.'},
  {q:'What are the main requirements for high-risk AI systems?',a:'The Regulation’s high-risk section includes requirements covering risk management, data and data governance, technical documentation, record-keeping, transparency and instructions, human oversight, and accuracy, robustness and cybersecurity.'},
  {q:'Are the Commission high-risk classification guidelines final?',a:'As of August 2026, the Commission has published draft guidelines on high-risk classification. They are useful interpretive material, but the Regulation itself remains the controlling legal text.'},
  {q:'Does using TA-14 prove that our high-risk AI system complies?',a:'No. TA-14 can preserve the classification basis, evidence, gaps, reviews and revalidation history. It does not itself provide legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function HighRiskRequirementsPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · ARTICLE 6 · HIGH-RISK AI"
  title="HIGH-RISK AI STARTS WITH"
  accent="THE CLASSIFICATION BASIS."
  intro="The hardest part of high-risk AI governance is not memorizing a list of requirements. It is proving why the system is or is not on a high-risk route, which actor obligations follow, what evidence supports each requirement, and whether that evidence still holds after the system changes."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 6 and High-Risk Requirements"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Article 6 defines the high-risk classification routes. The Regulation also requires documented support when a provider concludes that an Annex III system is not high-risk under Article 6(3). The Commission published draft high-risk classification guidance in May 2026 to support practical application."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=high-risk"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
