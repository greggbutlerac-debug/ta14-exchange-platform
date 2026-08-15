import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Recruitment and HR AI',
  description:'Understand when AI used for recruiting, hiring, promotion, dismissal, task allocation, monitoring, or worker evaluation may be high-risk under the EU AI Act and what evidence organizations should preserve.',
  alternates:{canonical:'/eu-ai-act/recruitment-hr'},
  keywords:['EU AI Act recruitment AI','EU AI Act HR AI','AI hiring compliance','AI recruitment high-risk','Annex III employment AI','AI Act employee monitoring'],
  openGraph:{title:'EU AI Act Compliance for Recruitment and HR AI | TA-14',description:'A governed guide to Annex III employment, recruitment, worker-management, and HR AI use cases.',url:'/eu-ai-act/recruitment-hr',type:'website'}
};

const cards=[
  {title:'IS THE AI USED TO RECRUIT OR SELECT PEOPLE?',copy:'Annex III includes certain employment use cases such as targeted job advertising, analysing or filtering job applications, and evaluating candidates. The intended purpose matters.'},
  {title:'DOES THE AI AFFECT PROMOTION, TERMINATION OR TASK ALLOCATION?',copy:'AI used for decisions affecting work-related contractual relationships, promotion, termination, task assignment or related decision-making can fall into the Annex III employment pathway.'},
  {title:'IS THE SYSTEM MONITORING OR EVALUATING WORKERS?',copy:'Systems intended to monitor or evaluate performance or behaviour in work-related contractual relationships can also fall within the high-risk employment category, subject to the Regulation’s exact conditions.'},
  {title:'WHAT EVIDENCE SUPPORTS THE CLASSIFICATION AND CONTROLS?',copy:'Preserve intended purpose, system version, decision role, data sources, human oversight, risk controls, instructions, testing, monitoring, worker-facing notices and any Article 6(3) assessment if relied on.'},
];

const steps=[
  {title:'Define the exact employment use case',copy:'Do not classify “HR software” as one category. Separate recruitment, candidate evaluation, promotion, dismissal, task allocation, monitoring and performance evaluation because the legal route depends on intended use.'},
  {title:'Determine whether the system is on an Annex III high-risk route',copy:'Map the intended purpose against Annex III and Article 6, preserving any unresolved facts or claimed Article 6(3) exclusion rather than forcing certainty.'},
  {title:'Bind controls and evidence to the decision pathway',copy:'Connect risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy, robustness and cybersecurity evidence to the employment decisions the system can influence.'},
  {title:'Revalidate after workflow or model change',copy:'A change from administrative assistance to candidate ranking, worker scoring, task allocation or monitoring can materially change the system’s classification and evidence requirements.'},
];

const faqs=[
  {q:'Is AI used for recruitment high-risk under the EU AI Act?',a:'Certain recruitment and employment AI use cases are listed in Annex III, including systems intended for targeted job advertising, analysing and filtering job applications, and evaluating candidates. Classification still depends on the exact intended purpose and Article 6.'},
  {q:'What about AI used for employee promotion or dismissal decisions?',a:'Annex III also covers certain AI systems intended to make decisions affecting work-related contractual relationships, including promotion or termination, and systems used to allocate tasks based on personal traits or characteristics or to monitor and evaluate performance and behaviour.'},
  {q:'Can an employment AI system ever avoid high-risk classification?',a:'Article 6(3) provides a limited route for some Annex III systems not to be treated as high-risk when they do not pose a significant risk of harm and one of the listed conditions applies. Providers relying on that route must document the assessment. Profiling systems remain high-risk.'},
  {q:'Does the AI Act replace employment or worker-protection law?',a:'No. The Regulation expressly preserves other Union law, including employment and worker-protection rules, and allows Member States to maintain or introduce provisions more favourable to workers.'},
  {q:'What should an employer preserve as evidence?',a:'At minimum, organizations should be able to show the system identity and version, intended purpose, role, classification basis, human oversight, relevant instructions, testing, monitoring, notices, limitations, changes and the evidence supporting each material decision.'},
  {q:'Does TA-14 certify our HR AI as compliant?',a:'No. TA-14 can structure and preserve the classification basis, evidence, gaps, review history and revalidation state. It does not itself provide legal advice, certification, conformity assessment or regulatory approval.'},
];

export default function RecruitmentHrPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · ANNEX III · EMPLOYMENT & WORKER MANAGEMENT"
  title="USING AI IN HIRING OR HR?"
  accent="START WITH THE USE CASE."
  intro="Recruitment and workforce AI can enter one of the EU AI Act’s most sensitive high-risk pathways. The critical question is not whether a product is branded as HR software—it is what the AI is intended to do, which decisions it influences, and what evidence supports that use."
  sourceLabel="European Commission · Navigating the AI Act · High-Risk Employment Examples"
  sourceHref="https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act"
  sourceNote="The Commission identifies employment and worker-management as an Annex III sensitive area and gives examples including targeted job advertising, analysing and filtering applications, and evaluating candidates. The Regulation also preserves other Union and national worker-protection rules."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=recruitment-hr"
  workspaceHref="/eu-ai-act/high-risk"
  workspaceLabel="OPEN HIGH-RISK WORKSPACE →"
/>}
