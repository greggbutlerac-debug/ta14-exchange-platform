import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Critical Infrastructure AI',
  description:'Understand when AI used in critical infrastructure may be high-risk under the EU AI Act, including safety components in critical digital infrastructure, road traffic, water, gas, heating and electricity systems.',
  alternates:{canonical:'/eu-ai-act/critical-infrastructure-ai'},
  keywords:['EU AI Act critical infrastructure AI','critical infrastructure high risk AI','AI electricity grid compliance EU','AI water infrastructure EU AI Act','critical digital infrastructure AI Act','Annex III critical infrastructure'],
  openGraph:{title:'EU AI Act Compliance for Critical Infrastructure AI | TA-14',description:'A governed guide to safety-component AI in critical digital and physical infrastructure under the EU AI Act.',url:'/eu-ai-act/critical-infrastructure-ai',type:'website'}
};

const cards=[
  {title:'IS THE AI A SAFETY COMPONENT?',copy:'Annex III classifies AI intended to be used as a safety component in the management and operation of critical digital infrastructure, road traffic, or the supply of water, gas, heating or electricity as high-risk.'},
  {title:'IS THE COMPONENT ACTUALLY PROTECTING SAFETY OR PHYSICAL INTEGRITY?',copy:'The Regulation explains that safety components directly protect the physical integrity of critical infrastructure or the health and safety of persons and property. Components used solely for cybersecurity are not treated as safety components for this Annex III route.'},
  {title:'WHAT HAPPENS IF THE AI FAILS OR DRIFTS?',copy:'For critical infrastructure, model error can become operational consequence. Preserve fallback modes, human override, safe-state logic, thresholds, alarms, maintenance evidence, incident records and the boundaries that prevent silent escalation.'},
  {title:'CAN YOU PROVE THE SYSTEM STAYED INSIDE ITS APPROVED ENVELOPE?',copy:'Preserve intended purpose, deployment location, system and model version, sensor/data sources, authority, operating limits, human oversight, risk controls, serious-incident history, material changes and revalidation decisions.'},
];

const steps=[
  {title:'Define the exact infrastructure function',copy:'Separate forecasting, optimisation, cybersecurity, maintenance prediction, dispatch, safety monitoring, shutdown protection and control. Not every AI system used by a critical-infrastructure operator is automatically high-risk.'},
  {title:'Determine whether the AI is a safety component or another regulated product component',copy:'Test the Annex III critical-infrastructure route and, where relevant, Article 6(1) product-safety routes under Annex I legislation. Preserve which classification route actually supports the result.'},
  {title:'Bind operational authority to evidence and safe-state controls',copy:'Connect risk management, technical documentation, logging, human oversight, accuracy, robustness, cybersecurity, alarms, fallback, override and maintenance evidence to the consequence-bearing function.'},
  {title:'Revalidate after operational or technical change',copy:'A model update, new sensor source, changed threshold, network expansion, control-system integration, operating-policy change or new infrastructure dependency can invalidate the prior risk and evidence state.'},
];

const faqs=[
  {q:'Is all AI used in critical infrastructure high-risk?',a:'No. Annex III specifically targets AI intended to be used as a safety component in the management and operation of critical digital infrastructure, road traffic, or the supply of water, gas, heating or electricity.'},
  {q:'What counts as a safety component?',a:'The Regulation describes safety components as systems used to directly protect the physical integrity of critical infrastructure or the health and safety of persons and property. Examples in the recitals include water-pressure monitoring and fire-alarm control systems in cloud-computing centres.'},
  {q:'Is cybersecurity AI in critical infrastructure automatically high-risk?',a:'Not under this Annex III safety-component route when the component is intended solely for cybersecurity purposes. Other legal or product routes may still apply, so the exact function must be classified.'},
  {q:'What evidence matters most for critical infrastructure AI?',a:'Preserve system identity and version, intended purpose, safety function, data and sensor provenance, authority, operating thresholds, human oversight, fallback and override logic, logs, incidents, maintenance, material changes, limitations and revalidation history.'},
  {q:'What if a critical-infrastructure AI system causes a major disruption?',a:'The Regulation defines a serious incident to include a serious and irreversible disruption of the management or operation of critical infrastructure. Providers of high-risk systems are subject to serious-incident reporting duties under the Act.'},
  {q:'Does TA-14 certify a critical-infrastructure AI deployment as compliant?',a:'No. TA-14 can preserve the classification basis, safety evidence, authority, operating limits, gaps, change history and revalidation state. It does not itself provide legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function CriticalInfrastructureAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · CRITICAL INFRASTRUCTURE · SAFETY-COMPONENT AI"
  title="WHEN AI CAN AFFECT WATER, POWER, TRAFFIC OR DIGITAL INFRASTRUCTURE,"
  accent="FAILURE HAS TO BE GOVERNED BEFORE CONSEQUENCE."
  intro="Critical-infrastructure AI is not high-risk merely because it is important. The key question is whether the system functions as a safety component in the management or operation of critical infrastructure—or falls under another Article 6 high-risk route. Once consequence can propagate into physical systems, continuity, fallback, authority and evidence become operational requirements, not paperwork."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 6 and Annex III, Point 2"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Annex III classifies AI intended as safety components in critical digital infrastructure, road traffic, or the supply of water, gas, heating or electricity as high-risk. The Regulation distinguishes these safety components from components used solely for cybersecurity and treats serious irreversible disruption of critical infrastructure as a serious incident."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=critical-infrastructure-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
