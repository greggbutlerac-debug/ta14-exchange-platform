import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Fundamental Rights Impact Assessment (FRIA) Compliance',
  description:'Understand Article 27 Fundamental Rights Impact Assessment obligations under the EU AI Act: who must perform a FRIA, when it is required, what it must contain, notification, DPIA coordination, updates and evidence.',
  alternates:{canonical:'/eu-ai-act/fundamental-rights-impact-assessment'},
  keywords:['EU AI Act FRIA','fundamental rights impact assessment AI Act','Article 27 AI Act','FRIA high risk AI','AI fundamental rights assessment EU','AI Act DPIA FRIA'],
  openGraph:{title:'EU AI Act Fundamental Rights Impact Assessment (FRIA) | TA-14',description:'A governed guide to Article 27 FRIA scope, contents, notification, DPIA coordination and revalidation.',url:'/eu-ai-act/fundamental-rights-impact-assessment',type:'website'}
};

const cards=[
  {title:'DOES ARTICLE 27 APPLY TO THIS DEPLOYER AND THIS HIGH-RISK SYSTEM?',copy:'FRIA is not universal. It applies before deployment of covered Article 6(2) high-risk systems to bodies governed by public law, private entities providing public services, and deployers of certain creditworthiness and life/health-insurance systems. Annex III point 2 critical-infrastructure systems are excluded from Article 27(1).'},
  {title:'IS THIS THE FIRST USE OR HAS THE CONTEXT CHANGED?',copy:'The Article 27 duty applies to first use. A deployer may rely on a prior FRIA in similar cases, but the record must be updated when the processes, affected groups, risks, oversight, mitigation or other relevant elements change or become stale.'},
  {title:'DOES THE ASSESSMENT COVER THE ACTUAL CONTEXT OF USE?',copy:'A FRIA must describe the deployer process, duration and frequency of use, affected categories of persons and groups, specific fundamental-rights risks, human-oversight measures, and measures for materialised risks including governance and complaint mechanisms.'},
  {title:'CAN THE FRIA BE PROVEN TO THE MARKET SURVEILLANCE AUTHORITY?',copy:'After completing the assessment, the deployer must notify the market surveillance authority of the results using the applicable template, subject to the Regulation’s stated exception. Preserve the completed assessment, notification state, source evidence and later updates.'},
];

const steps=[
  {title:'Confirm scope before drafting the assessment',copy:'Identify the high-risk system, Article 6 route, Annex III category, deployer type, intended purpose and whether the deployment falls within Article 27. Do not build a FRIA merely because the organisation uses AI.'},
  {title:'Map the real deployment context and affected groups',copy:'Document where and how the system is used, how often, for how long, who may be affected, which groups may be vulnerable, and what provider information under Article 13 is relevant to the assessment.'},
  {title:'Connect risks to oversight, mitigation, complaints and redress',copy:'For each material fundamental-rights risk, preserve the human-oversight measure, governance control, intervention path, complaint mechanism, mitigation measure and accountable decision-maker.'},
  {title:'Notify, preserve and revalidate the FRIA',copy:'Record the market-surveillance notification state, coordinate overlapping DPIA evidence where applicable, and update the FRIA whenever the deployment context or Article 27 elements change or are no longer current.'},
];

const faqs=[
  {q:'Who must conduct a FRIA under the EU AI Act?',a:'Article 27 covers deployers of specified Article 6(2) high-risk systems that are bodies governed by public law or private entities providing public services, plus deployers of the high-risk systems in Annex III points 5(b) and 5(c), covering creditworthiness/credit scoring and life or health insurance risk assessment and pricing.'},
  {q:'Does every high-risk AI system require a FRIA?',a:'No. Article 27 has a specific scope. It applies to covered deployers and Article 6(2) high-risk systems, with an express exception for systems in Annex III point 2 concerning critical infrastructure.'},
  {q:'What must a FRIA contain?',a:'Article 27 requires the deployer process, intended duration and frequency of use, affected categories of persons and groups, specific risks of harm to fundamental rights, implementation of human oversight, and measures for materialised risks including internal governance and complaint mechanisms.'},
  {q:'Can an existing DPIA replace the FRIA?',a:'Not automatically. Where Article 27 obligations are already met through a GDPR or law-enforcement data-protection impact assessment, the FRIA complements that DPIA rather than duplicating the same work.'},
  {q:'Does the FRIA have to be updated?',a:'Yes. Article 27 applies to first use and requires the deployer to update the assessment information if relevant elements change or are no longer up to date. Similar cases may rely on previous FRIAs or existing provider impact assessments where appropriate.'},
  {q:'Must the FRIA be sent to an authority?',a:'After the assessment is performed, Article 27 requires the deployer to notify the market surveillance authority of the results using the applicable template, subject to the Regulation’s stated exception for certain Article 46(1) cases.'},
  {q:'Does TA-14 certify a FRIA as legally sufficient?',a:'No. TA-14 can preserve the FRIA scope decision, evidence, affected-group analysis, risk-to-control mapping, notification state, updates, gaps and revalidation history. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function FundamentalRightsImpactAssessmentPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · ARTICLE 27 · FRIA · FUNDAMENTAL RIGHTS"
  title="A FRIA IS NOT A FORM."
  accent="IT IS A RECORD OF WHY THIS DEPLOYMENT REMAINS JUSTIFIABLE."
  intro="Article 27 requires certain deployers of high-risk AI systems to assess the fundamental-rights impact of the actual context in which the system will be used. The assessment must connect the deployment process, affected people, specific risks, human oversight, mitigation, complaints, notification and later changes into one reviewable record."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 27"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Article 27 requires covered public-law bodies, private entities providing public services, and deployers of specified creditworthiness and life/health-insurance high-risk systems to perform a fundamental-rights impact assessment before first use. The assessment must be updated when relevant elements change and generally notified to the market surveillance authority."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=fundamental-rights-impact-assessment"
  workspaceHref="/eu-ai-act/fundamental-rights"
  workspaceLabel="OPEN FUNDAMENTAL RIGHTS WORKSPACE →"
/>}
