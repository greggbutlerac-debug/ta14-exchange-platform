import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Public Benefits and Essential Services AI',
  description:'Understand when AI used for public benefits, healthcare access, social services, emergency response, and other essential services may be high-risk under the EU AI Act.',
  alternates:{canonical:'/eu-ai-act/public-benefits-essential-services-ai'},
  keywords:['EU AI Act public benefits AI','EU AI Act essential services','AI public assistance high risk','social benefits AI Act','emergency dispatch AI high risk','Annex III essential services AI'],
  openGraph:{title:'EU AI Act Compliance for Public Benefits and Essential Services AI | TA-14',description:'A governed guide to Annex III public-benefits and essential-services AI pathways.',url:'/eu-ai-act/public-benefits-essential-services-ai',type:'website'}
};

const cards=[
  {title:'IS AI DETERMINING ELIGIBILITY FOR PUBLIC ASSISTANCE?',copy:'Annex III identifies AI used by or on behalf of public authorities to evaluate eligibility for essential public assistance benefits and services, including healthcare, or to grant, reduce, revoke, or reclaim those benefits and services as high-risk.'},
  {title:'IS AI SHAPING ACCESS TO ESSENTIAL PRIVATE SERVICES?',copy:'Creditworthiness and credit-score systems can affect access to financial resources and essential services such as housing, electricity and telecommunications, which is why those uses sit on a high-risk route subject to the Regulation’s stated exceptions.'},
  {title:'IS THE SYSTEM TRIAGING EMERGENCY CALLS OR RESPONSE?',copy:'Annex III also classifies systems used to evaluate or classify emergency calls, dispatch or prioritise police, firefighters or medical aid, and emergency healthcare patient triage as high-risk.'},
  {title:'CAN YOU PROVE THE DECISION, REVIEW AND REMEDY PATH?',copy:'Preserve intended purpose, system version, data sources, eligibility or prioritisation rules, human review, notices, override and appeal pathways, logs, changes, limitations, and the evidence supporting each consequential determination.'},
];

const steps=[
  {title:'Define the exact benefit or service decision',copy:'Separate eligibility, scoring, triage, prioritisation, reduction, revocation, reclamation, dispatch and purely administrative support. Different functions can create very different governance obligations.'},
  {title:'Classify under Annex III and preserve any Article 6(3) analysis',copy:'Determine whether the system materially influences a listed decision. If a provider relies on the Article 6(3) non-high-risk route for an Annex III system, that assessment must be documented before market placement or putting into service.'},
  {title:'Bind human review and recourse to the evidence record',copy:'Connect the system’s output, underlying evidence, decision authority, human review, notice, override, complaint or appeal pathway, and any correction record so the outcome can be reconstructed and challenged where required.'},
  {title:'Revalidate after policy, model, data or service changes',copy:'A changed eligibility rule, benefit policy, dispatch threshold, model, dataset, service definition, authority or legal source can make the previous classification and evidence stale.'},
];

const faqs=[
  {q:'Is AI used for public benefits high-risk under the EU AI Act?',a:'Certain systems are. Annex III identifies AI used by or on behalf of public authorities to evaluate eligibility for essential public assistance benefits and services, including healthcare, or to grant, reduce, revoke or reclaim those benefits and services as high-risk.'},
  {q:'Which public benefits are relevant?',a:'The Regulation’s recitals refer to areas including healthcare services, social security benefits, social services relating to maternity, illness, industrial accidents, dependency, old age, unemployment, and social and housing assistance.'},
  {q:'Are emergency-response AI systems high-risk?',a:'Yes, specified systems used to evaluate and classify emergency calls, dispatch or prioritise emergency first-response services, and emergency healthcare patient triage are listed in Annex III as high-risk.'},
  {q:'Does every system used by a public authority become high-risk?',a:'No. The classification depends on intended purpose and whether the system falls within a listed Annex III use case or another Article 6 route. Purely administrative support is not automatically high-risk merely because a public authority uses it.'},
  {q:'What evidence should organizations preserve?',a:'Preserve system identity and version, intended purpose, classification basis, policy or eligibility rules, data provenance, human review, notices, recourse and appeal routes, logs, changes, limitations, and the evidence supporting the decision.'},
  {q:'Does TA-14 determine legal entitlement to a benefit or service?',a:'No. TA-14 can preserve the classification basis, authority claim, evidence, decision scope, gaps, review history and revalidation state. It does not provide legal entitlement decisions, legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function PublicBenefitsEssentialServicesAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · PUBLIC BENEFITS · ESSENTIAL SERVICES · HIGH-RISK AI"
  title="WHEN AI CAN GRANT, DENY OR PRIORITISE ESSENTIAL SUPPORT,"
  accent="THE DECISION HAS TO BE REVIEWABLE."
  intro="AI used for public benefits and essential services can directly affect healthcare access, social assistance, housing support, emergency response and other conditions people rely on to participate in society. The governance burden is not just classification—it is preserving the evidence, human review, authority and recourse path behind the outcome."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Annex III, Point 5"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Annex III classifies specified AI used for essential public assistance benefits and services, creditworthiness, life and health insurance pricing, and emergency-response or patient-triage decisions as high-risk. The Regulation’s recitals emphasise the potential impact of these systems on livelihood, non-discrimination, dignity and effective remedy."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=public-benefits-essential-services-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
