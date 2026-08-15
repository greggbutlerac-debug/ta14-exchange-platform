import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act AI Literacy Requirements for Businesses',
  description:'Understand EU AI Act Article 4 AI literacy obligations for providers and deployers, what businesses should preserve as evidence, and how to assess readiness.',
  alternates:{canonical:'/eu-ai-act/ai-literacy'},
  keywords:['EU AI Act AI literacy','Article 4 AI Act','AI literacy requirements','AI training EU AI Act','AI Act employee training','AI literacy compliance'],
  openGraph:{title:'EU AI Act AI Literacy Requirements | TA-14',description:'A governed operating guide to Article 4 AI literacy for providers and deployers.',url:'/eu-ai-act/ai-literacy',type:'website'}
};

const cards=[
  {title:'WHO IS USING OR OPERATING THE AI?',copy:'Identify the provider or deployer, the staff involved, and other people using or operating AI systems on the organization’s behalf. The obligation is role- and context-sensitive.'},
  {title:'WHAT DO THEY ACTUALLY NEED TO UNDERSTAND?',copy:'Map literacy to the person’s role, technical knowledge, experience, education, training and the context in which the AI system is used. A generic annual course may not match the operational risk.'},
  {title:'WHAT RISKS AND LIMITATIONS MUST BE UNDERSTOOD?',copy:'Preserve the system-specific risks, possible harms, limitations, human-oversight expectations, escalation routes and prohibited or restricted uses relevant to the person’s work.'},
  {title:'WHAT EVIDENCE SHOWS THE MEASURES WERE TAKEN?',copy:'Keep attributable records of who received what instruction, when, for which system or use case, what changed, and whether re-training or revalidation became necessary.'},
];

const steps=[
  {title:'Identify the AI system and operating context',copy:'Start with the actual system, intended purpose, role and affected workflows instead of creating an organization-wide training claim detached from use.'},
  {title:'Define the literacy proposition',copy:'State what the relevant people need to know to make informed use of the system and recognize opportunities, risks and possible harms.'},
  {title:'Bind training and guidance evidence',copy:'Preserve the training, policies, instructions, assessments, acknowledgements or other evidence that supports the claimed literacy measures.'},
  {title:'Revalidate when the system or use changes',copy:'A new model, workflow, deployment context, role, authority boundary or material risk can make yesterday’s literacy record insufficient for today’s use.'},
];

const faqs=[
  {q:'Does Article 4 apply only to high-risk AI?',a:'No. The Commission’s current guidance describes Article 4 as an obligation for providers and deployers of AI systems generally, not only high-risk systems.'},
  {q:'Did the AI literacy obligation already start?',a:'Yes. Article 4 entered into application on 2 February 2025. The Commission also notes that Article 4 was amended by the Digital Omnibus on AI, which entered into force in mid-July 2026.'},
  {q:'Is there one mandatory training course or number of hours?',a:'The Commission’s current Q&A says no specific or “sufficient” level is prescribed. Measures should be appropriate to role, knowledge, experience, training and the context in which the AI system is used.'},
  {q:'Do we need to keep records?',a:'The Regulation does not reduce AI literacy to a single certificate. From an evidence-governance perspective, organizations should preserve what measures were taken, for whom, for which system and why those measures were considered appropriate.'},
  {q:'Does buying training software prove compliance?',a:'No. Software, course completion or a TA-14 record can support evidence continuity, but none of those by themselves establish a legal compliance conclusion.'},
  {q:'Can TA-14 help us organize the evidence?',a:'Yes. The EU AI Act world can preserve system identity, role, obligation mapping, evidence, limitations, change and revalidation without claiming that the platform itself grants compliance.'},
];

export default function AiLiteracyPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · ARTICLE 4 · AI LITERACY"
  title="AI LITERACY IS NOT JUST"
  accent="A TRAINING CHECKBOX."
  intro="Article 4 requires providers and deployers to take measures supporting AI literacy for relevant staff and other people using AI systems on their behalf. The practical challenge is showing that the measures fit the people, the system, the context and the risks."
  sourceLabel="European Commission · AI Literacy Questions & Answers"
  sourceHref="https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers"
  sourceNote="The Commission states that Article 4 entered into application on 2 February 2025 and was later amended by the Digital Omnibus on AI in mid-July 2026. AI literacy remains an obligation for providers and deployers, while no single prescribed literacy level applies to every organization."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=ai-literacy"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="BUILD THE GOVERNED EVIDENCE RECORD →"
/>}
