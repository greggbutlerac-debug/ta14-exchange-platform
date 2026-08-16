import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Healthcare and Medical AI',
  description:'Understand when healthcare and medical AI may be high-risk under the EU AI Act, including medical-device pathways, clinical decision support, human oversight, risk management, evidence, and change control.',
  alternates:{canonical:'/eu-ai-act/healthcare-medical-ai'},
  keywords:['EU AI Act healthcare AI','EU AI Act medical AI','medical device AI high risk','clinical AI compliance EU','AI medical device regulation Europe','AI clinical decision support EU'],
  openGraph:{title:'EU AI Act Compliance for Healthcare and Medical AI | TA-14',description:'A governed guide to medical-device, clinical decision-support, and healthcare AI pathways under the EU AI Act.',url:'/eu-ai-act/healthcare-medical-ai',type:'website'}
};

const cards=[
  {title:'IS THE AI ITSELF A MEDICAL DEVICE OR A SAFETY COMPONENT?',copy:'Article 6 can classify AI as high-risk when it is a product, or a safety component of a product, covered by Annex I legislation and the product requires third-party conformity assessment. Medical devices and in vitro diagnostic medical devices are specifically included in that product framework.'},
  {title:'IS THE SYSTEM SUPPORTING A CLINICAL OR HEALTH DECISION?',copy:'Clinical decision support, diagnostics, triage, treatment recommendations, monitoring, prioritization, and other health-related uses should be classified by intended purpose and actual decision role—not by the fact that the product uses AI.'},
  {title:'WHAT HUMAN OVERSIGHT AND RISK CONTROLS EXIST?',copy:'For high-risk systems, the Act requires a continuous risk-management process and human-oversight measures appropriate to the intended purpose. Preserve who can review, override, interrupt, or refuse reliance on the AI output.'},
  {title:'CAN THE EVIDENCE SURVIVE A MODEL OR WORKFLOW CHANGE?',copy:'Healthcare systems evolve. Preserve versions, validation data, performance evidence, risk controls, instructions, post-market information, material changes, and the revalidation basis so an old clinical claim does not silently attach to a new system state.'},
];

const steps=[
  {title:'Define the regulated product and AI system boundary',copy:'Separate the medical device or IVD, the AI component, external models, cloud services, clinical workflow, and downstream human decision. The correct boundary determines which product and AI Act obligations attach.'},
  {title:'Classify under Article 6 and intended purpose',copy:'Determine whether the system enters the Annex I product route, an Annex III route, or another obligation pathway. Preserve the basis for the classification rather than relying on a generic “healthcare AI” label.'},
  {title:'Bind risk, performance, oversight and documentation evidence',copy:'Connect risk management, technical documentation, validation, data governance, logging, instructions, human oversight, accuracy, robustness, cybersecurity, and post-market evidence to the claims they support.'},
  {title:'Revalidate after clinical, technical or regulatory change',copy:'A changed model, dataset, intended purpose, indication, workflow, threshold, user population, product integration, or legal-source state can change whether yesterday’s evidence remains admissible for today’s use.'},
];

const faqs=[
  {q:'Are medical-device AI systems high-risk under the EU AI Act?',a:'They can be. Article 6 treats an AI system as high-risk when it is a product, or a safety component of a product, covered by Annex I legislation and the relevant product requires third-party conformity assessment. Medical devices and in vitro diagnostic medical devices are included among those product categories.'},
  {q:'Does “high-risk under the AI Act” mean the medical device itself is high-risk under MDR or IVDR?',a:'Not necessarily. The Regulation expressly distinguishes AI Act high-risk classification from the risk classification used in the relevant product legislation. The two regimes can apply together without using the same risk labels.'},
  {q:'What does the AI Act require for high-risk healthcare AI?',a:'Among other requirements, high-risk systems are subject to risk management, data governance, technical documentation, record-keeping, transparency and instructions for use, human oversight, and requirements relating to accuracy, robustness and cybersecurity.'},
  {q:'What is especially important for clinical decision support?',a:'The intended purpose and degree of influence over the clinical decision are critical. Organizations should preserve the system’s role, performance evidence, limitations, human-review requirements, escalation paths, and the exact conditions under which outputs may or may not be relied upon.'},
  {q:'Can healthcare AI rely on the same evidence forever once validated?',a:'No. Model updates, new data, changed clinical workflows, new patient populations, revised thresholds, changed intended purpose, or altered product integration can make prior validation or classification evidence stale.'},
  {q:'Does TA-14 certify a healthcare AI system as compliant?',a:'No. TA-14 can preserve the classification basis, evidence, gaps, review history, change events, and revalidation state. It does not itself provide legal advice, medical-device conformity assessment, certification, or regulatory approval.'},
];

export default function HealthcareMedicalAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · HEALTHCARE · MEDICAL DEVICES · CLINICAL AI"
  title="IN HEALTHCARE, THE QUESTION ISN’T JUST"
  accent="WHETHER THE MODEL WORKS."
  intro="Medical and clinical AI sits where technical performance, product regulation, human oversight, patient safety, and evidence continuity meet. The business needs to know what the AI is, what regulated product it belongs to, what decision it influences, and whether the current evidence still supports that use."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 6, Annex I and High-Risk Requirements"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Article 6 classifies certain AI systems as high-risk when they are products or safety components covered by Annex I legislation and subject to third-party conformity assessment. The Regulation specifically includes medical devices and in vitro diagnostic medical devices among the relevant product categories and requires continuing risk management and other high-risk controls."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=healthcare-medical-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
