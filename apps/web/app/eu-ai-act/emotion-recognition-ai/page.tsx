import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Emotion Recognition AI',
  description:'Understand when emotion-recognition AI is prohibited, high-risk, or subject to Article 50 transparency duties under the EU AI Act, including workplace and education restrictions, disclosure, evidence, and revalidation.',
  alternates:{canonical:'/eu-ai-act/emotion-recognition-ai'},
  keywords:['EU AI Act emotion recognition','emotion recognition workplace AI Act','emotion recognition education prohibited AI','Article 50 emotion recognition','emotion AI compliance Europe','Annex III emotion recognition'],
  openGraph:{title:'EU AI Act Compliance for Emotion Recognition AI | TA-14',description:'A governed guide to prohibited, high-risk and transparency pathways for emotion-recognition AI.',url:'/eu-ai-act/emotion-recognition-ai',type:'website'}
};

const cards=[
  {title:'IS THE SYSTEM INFERRING EMOTIONS IN A WORKPLACE OR EDUCATION SETTING?',copy:'Article 5 prohibits placing on the market, putting into service for that purpose, or using AI systems to infer emotions of natural persons in workplaces and education institutions, except where the system is intended for medical or safety reasons.'},
  {title:'DOES A MEDICAL OR SAFETY EXCEPTION ACTUALLY APPLY?',copy:'An exception should be treated as an evidence claim, not a label. Preserve the intended purpose, deployment context, responsible operator, medical or safety rationale, scope boundaries, approvals and evidence showing that the system is not being repurposed beyond the exception.'},
  {title:'IS THE USE PERMITTED BUT HIGH-RISK?',copy:'Where emotion-recognition use is not prohibited, Annex III can place specified emotion-recognition systems on a high-risk route. The exact function, context and applicable exclusions still need to be classified.'},
  {title:'ARE PEOPLE TOLD THEY ARE EXPOSED TO EMOTION RECOGNITION?',copy:'Article 50 requires deployers of emotion-recognition systems to inform natural persons exposed to the operation of the system, subject to the Regulation’s stated exceptions. These transparency duties apply from 2 August 2026.'},
];

const steps=[
  {title:'Test the prohibited-practice route first',copy:'Before asking how to comply, determine whether the intended use is barred under Article 5. Workplace and education emotion inference should not be treated as merely another high-risk deployment unless a valid medical or safety exception applies.'},
  {title:'Classify the permitted use and operator role',copy:'Define whether the system infers emotion from biometric data, who provides and deploys it, the intended purpose, whether Annex III high-risk classification applies, and what other sector-specific rules govern the deployment.'},
  {title:'Bind disclosure and exception evidence to the deployed system',copy:'Preserve the system version, affected population, disclosure method, intended purpose, exception basis, human oversight, logs, performance limits, data inputs, complaints or challenges, and the evidence supporting continued use.'},
  {title:'Revalidate after purpose, model or deployment changes',copy:'A move into a school or workplace, a new emotion category, changed sensor modality, model update, new safety rationale, removed disclosure, or broader decision use can materially change the legal route and evidence state.'},
];

const faqs=[
  {q:'Is emotion-recognition AI banned in the EU?',a:'Not in every context. Article 5 prohibits AI used to infer emotions of natural persons in workplaces and education institutions, except where the system is intended for medical or safety reasons. Other emotion-recognition uses may instead fall under high-risk or transparency obligations.'},
  {q:'Can employers use AI to infer worker emotions?',a:'Article 5 prohibits that practice in the workplace, subject to the Regulation’s medical or safety exception. A general productivity, engagement, hiring or performance-management purpose should not be treated as falling within that exception without a supportable legal basis.'},
  {q:'Can schools use emotion-recognition AI?',a:'Article 5 also prohibits emotion inference in education institutions, again subject to the medical or safety exception. Separate education AI uses such as admissions, assessment or exam monitoring can raise different Annex III questions.'},
  {q:'Do people have to be told when emotion-recognition AI is used?',a:'Article 50 requires deployers of emotion-recognition systems to inform natural persons exposed to the operation of those systems, subject to the Regulation’s stated exceptions. The Commission’s current transparency guidance confirms that these obligations apply from 2 August 2026.'},
  {q:'What evidence should be preserved for a claimed medical or safety exception?',a:'Preserve the precise intended purpose, safety or medical rationale, deployment setting, responsible authority, approvals, affected population, system version, scope limits, oversight, data and sensor sources, performance evidence, disclosures, changes, and the basis for continued reliance on the exception.'},
  {q:'Does TA-14 certify an emotion-recognition system as compliant or exempt?',a:'No. TA-14 can preserve the classification basis, exception claim, disclosure evidence, scope, gaps, review history and revalidation state. It does not provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function EmotionRecognitionAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · EMOTION RECOGNITION · ARTICLE 5 · ARTICLE 50"
  title="BEFORE YOU GOVERN EMOTION AI,"
  accent="CHECK WHETHER THE USE IS ALLOWED AT ALL."
  intro="Emotion-recognition AI sits across three distinct EU AI Act pathways: prohibited practices, high-risk classification, and transparency. In workplaces and education institutions, emotion inference is generally prohibited unless the system is intended for medical or safety reasons. In other contexts, high-risk and Article 50 duties can still apply."
  sourceLabel="EUR-Lex · Regulation (EU) 2024/1689 · Article 5, Annex III and Article 50"
  sourceHref="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  sourceNote="Article 5 prohibits emotion inference in workplaces and education institutions except for medical or safety reasons. Article 50 requires deployers of emotion-recognition systems to inform people exposed to their operation, and the Commission confirms those transparency obligations have applied since 2 August 2026."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=emotion-recognition-ai"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
