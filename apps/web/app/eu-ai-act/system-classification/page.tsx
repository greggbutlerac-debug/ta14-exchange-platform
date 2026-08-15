import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act System Classification: Is My AI High-Risk?',
  description:'Classify an AI system under the EU AI Act by role, intended purpose, Annex I and Annex III pathways, transparency obligations, and other relevant risk categories.',
  alternates:{canonical:'/eu-ai-act/system-classification'},
  keywords:['EU AI Act classification','AI risk classification EU','is my AI high risk','Article 6 classification','Annex III AI classification','AI Act classifier'],
  openGraph:{title:'EU AI Act System Classification | TA-14',description:'Understand how to classify an AI system under the EU AI Act, then run the free TA-14 classifier.',url:'/eu-ai-act/system-classification',type:'website'}
};

const cards=[
  {title:'WHAT EXACTLY IS THE AI SYSTEM?',copy:'Start by defining the system boundary, intended purpose, model dependencies, product integration, version, deployment context, and what decisions or outputs the system can produce.'},
  {title:'WHAT ROLE DOES YOUR ORGANIZATION HAVE?',copy:'Determine whether you are acting as provider, deployer, importer, distributor, product manufacturer, GPAI provider, or another operator. Different roles carry different duties.'},
  {title:'WHICH RISK OR OBLIGATION ROUTE APPLIES?',copy:'Check prohibited practices, high-risk routes under Article 6 and Annex I/III, transparency duties under Article 50, GPAI obligations, and other relevant system-specific requirements.'},
  {title:'WHAT FACTS SUPPORT THE CLASSIFICATION?',copy:'Preserve the evidence supporting intended purpose, actor role, use case, exclusions, customer context, product category, and any Article 6(3) assessment. Classification should be reviewable, not just asserted.'},
];

const steps=[
  {title:'Identify the real system and intended purpose',copy:'Do not classify a vendor name or a generic technology category. Classify the actual AI system as placed on the market or used in the organization.'},
  {title:'Determine operator role and territorial scope',copy:'Establish who develops, brands, places, imports, distributes or deploys the system and whether the EU AI Act’s territorial scope is engaged.'},
  {title:'Test the relevant regulatory routes',copy:'Evaluate prohibited-use rules, Article 6 high-risk criteria, Annex III use cases, Article 50 transparency obligations, GPAI layers and any applicable exclusions or special conditions.'},
  {title:'Preserve the classification basis and revalidate it',copy:'Keep the facts, evidence, version and source state that support the result. Re-run classification after material changes to intended purpose, model, workflow, authority, market exposure or legal guidance.'},
];

const faqs=[
  {q:'How does the EU AI Act classify AI systems?',a:'The Act uses a risk-based and obligation-based structure. Some practices are prohibited, some systems are high-risk under Article 6 and Annex I or Annex III, some are subject to transparency obligations, and many systems carry limited or minimal regulatory burden under the Act.'},
  {q:'Is every AI system either high-risk or low-risk?',a:'No. The practical classification is more nuanced. A system may be prohibited for a particular use, high-risk, subject mainly to transparency duties, affected by GPAI obligations at another layer, or fall outside those categories while still being subject to other legal duties.'},
  {q:'What are the two main high-risk routes?',a:'Article 6 identifies high-risk systems connected to certain regulated products in Annex I and systems used for certain sensitive purposes listed in Annex III. The Commission has also published current guidance and examples to support practical classification.'},
  {q:'Can an Annex III system ever be treated as not high-risk?',a:'In limited circumstances, yes. Article 6(3) provides conditions under which some Annex III systems may not be considered high-risk where they do not pose a significant risk of harm. Providers relying on that route must document the assessment before market placement or putting into service.'},
  {q:'Can a chatbot still have EU AI Act obligations if it is not high-risk?',a:'Yes. Article 50 transparency obligations can apply to certain systems that interact directly with people or generate or manipulate content, independently of high-risk classification.'},
  {q:'Does the TA-14 classifier provide a legal determination?',a:'No. It provides a structured governance classification pathway based on the facts supplied. It does not replace legal advice, conformity assessment, certification or regulatory authority.'},
];

export default function SystemClassificationPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · SYSTEM CLASSIFICATION · FREE ENTRY"
  title="IS YOUR AI SYSTEM"
  accent="HIGH-RISK, TRANSPARENCY-BOUND, OR SOMETHING ELSE?"
  intro="Before building a compliance program, classify the actual system. EU AI Act obligations depend on intended purpose, operator role, product context, use case, territorial scope and the facts supporting each classification route."
  sourceLabel="European Commission · Navigating the AI Act and High-Risk Classification Guidance"
  sourceHref="https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act"
  sourceNote="The Commission describes the AI Act as risk-based and confirms that only a limited set of systems are classified as high-risk. Current Commission guidance supports practical Article 6 classification, but the Regulation itself remains the controlling legal text."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=system-classification"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="SEE WHAT HAPPENS AFTER CLASSIFICATION →"
/>}
