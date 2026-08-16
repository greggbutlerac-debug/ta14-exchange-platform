import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for General-Purpose AI and GPAI Providers',
  description:'Understand EU AI Act obligations for providers of general-purpose AI models, including technical documentation, downstream information, copyright policy, training-content summaries, systemic-risk duties, evaluation and incident reporting.',
  alternates:{canonical:'/eu-ai-act/gpai-providers'},
  keywords:['EU AI Act GPAI','general purpose AI provider obligations','Article 53 GPAI','systemic risk GPAI','GPAI Code of Practice','AI model provider compliance EU'],
  openGraph:{title:'EU AI Act Compliance for GPAI Providers | TA-14',description:'A governed guide to Article 53 and Article 55 obligations for general-purpose AI model providers.',url:'/eu-ai-act/gpai-providers',type:'website'}
};

const cards=[
  {title:'ARE YOU A PROVIDER OF A GENERAL-PURPOSE AI MODEL?',copy:'The first question is whether the model qualifies as GPAI and whether your organisation is the provider placing it on the EU market. Significant modifications can also move an actor into provider obligations under current Commission guidance.'},
  {title:'CAN DOWNSTREAM PROVIDERS UNDERSTAND YOUR MODEL?',copy:'Article 53 requires providers to maintain technical documentation and make sufficient information available to downstream AI-system providers so they can understand capabilities, limitations and relevant compliance conditions.'},
  {title:'ARE COPYRIGHT AND TRAINING-CONTENT DUTIES COVERED?',copy:'Providers must put in place a policy to comply with Union copyright and related-rights law and publish a sufficiently detailed summary of the content used for training according to the AI Office template.'},
  {title:'DOES THE MODEL PRESENT SYSTEMIC RISK?',copy:'Providers of GPAI models with systemic risk face additional Article 55 duties, including model evaluation, adversarial testing, systemic-risk assessment and mitigation, serious-incident reporting, and adequate cybersecurity protection.'},
];

const steps=[
  {title:'Determine whether the model and organisation fall within GPAI provider scope',copy:'Separate the model from the downstream AI system, identify who places the model on the market, and preserve the basis for whether the organisation is a provider, modifier, integrator, distributor or downstream system provider.'},
  {title:'Build and maintain the Article 53 evidence package',copy:'Preserve technical documentation, training and testing information, evaluation results, downstream documentation, copyright-policy evidence, training-content summary, version history and authorised-representative information where applicable.'},
  {title:'Assess systemic-risk status and notification duties',copy:'Determine whether the model meets or may meet systemic-risk criteria, preserve the assessment, and document notifications, requests for reassessment, safety and security evidence, and any reliance on the GPAI Code of Practice or alternative compliance method.'},
  {title:'Revalidate after material model or release changes',copy:'A major model update, new capabilities, changed training process, new release terms, significant modification, changed downstream use profile or new systemic-risk evidence can alter the provider’s obligations and prior documentation.'},
];

const faqs=[
  {q:'When did GPAI provider obligations start applying?',a:'The Commission states that obligations for providers of general-purpose AI models entered into application on 2 August 2025. From 2 August 2026, the Commission’s enforcement powers apply, including the ability to enforce compliance through fines.'},
  {q:'What does Article 53 require from GPAI providers?',a:'Article 53 requires technical documentation, information and documentation for downstream AI-system providers, a policy to comply with Union copyright and related-rights law, and a sufficiently detailed public summary of the content used for training.'},
  {q:'Are open-source GPAI models exempt?',a:'There is a limited exemption from certain Article 53 documentation duties for qualifying free and open-source models whose relevant parameters and information are publicly available. That exemption does not apply to GPAI models with systemic risk.'},
  {q:'What extra obligations apply to GPAI models with systemic risk?',a:'Article 55 adds model evaluation, documented adversarial testing, systemic-risk assessment and mitigation, serious-incident tracking and reporting, and adequate cybersecurity protection for the model and relevant physical infrastructure.'},
  {q:'Does integrating a GPAI model into a product remove model-provider obligations?',a:'No. The Regulation distinguishes model obligations from downstream AI-system obligations. When a provider places its own GPAI model on the market as part of an AI system, model-level obligations can continue to apply alongside system-level duties.'},
  {q:'Does TA-14 certify a GPAI provider as compliant?',a:'No. TA-14 can preserve the provider-role analysis, documentation state, evidence, gaps, systemic-risk assessment, changes and revalidation history. It does not itself provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function GpaiProvidersPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · GPAI · MODEL PROVIDERS · SYSTEMIC RISK"
  title="IF YOUR MODEL POWERS MANY SYSTEMS,"
  accent="YOUR EVIDENCE HAS TO TRAVEL DOWNSTREAM."
  intro="General-purpose AI providers sit at the top of a long compliance chain. The obligation is not only to know how the model was built, but to maintain the documentation, copyright controls, training-content transparency, downstream information and—where applicable—systemic-risk evidence that other actors need to govern their own AI systems."
  sourceLabel="European Commission · Guidelines for Providers of General-Purpose AI Models"
  sourceHref="https://digital-strategy.ec.europa.eu/en/policies/guidelines-gpai-providers"
  sourceNote="The Commission states that GPAI provider obligations have applied since 2 August 2025 and that full Commission enforcement powers apply from 2 August 2026. Article 53 covers documentation, downstream information, copyright policy and training-content summaries; Article 55 adds evaluation, systemic-risk mitigation, incident reporting and cybersecurity for GPAI models with systemic risk."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=gpai-provider"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE GPAI EVIDENCE RECORD →"
/>}
