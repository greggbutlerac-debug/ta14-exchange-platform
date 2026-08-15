import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
  title:'EU AI Act Compliance for Customer Service AI and Business Chatbots',
  description:'Understand EU AI Act transparency duties for customer-facing chatbots and interactive AI, plus the evidence, escalation, version, and governance records businesses should preserve.',
  alternates:{canonical:'/eu-ai-act/customer-service-ai'},
  keywords:['EU AI Act customer service AI','EU AI Act business chatbot','chatbot transparency Article 50','AI customer support compliance','interactive AI disclosure EU','AI assistant customer service'],
  openGraph:{title:'EU AI Act Compliance for Customer Service AI | TA-14',description:'A governed guide to Article 50 transparency for customer-facing chatbots and interactive AI.',url:'/eu-ai-act/customer-service-ai',type:'website'}
};

const cards=[
  {title:'ARE PEOPLE DIRECTLY INTERACTING WITH AI?',copy:'Article 50 requires providers to design certain directly interactive AI systems so people are informed that they are interacting with AI, unless that is obvious to a reasonably well-informed person in the circumstances.'},
  {title:'IS THE DISCLOSURE ACTUALLY PRESENT AT THE RIGHT MOMENT?',copy:'A policy page is not the same as an in-context disclosure. Preserve where the notice appears, which interface/version it belongs to, and whether the customer encounters it before or during the interaction.'},
  {title:'CAN THE BOT TAKE OR TRIGGER CONSEQUENTIAL ACTIONS?',copy:'A customer-service assistant that answers FAQs is not the same governance problem as one that changes accounts, denies service, recommends regulated products, makes eligibility judgments, or triggers downstream action.'},
  {title:'CAN A HUMAN TAKE OVER WHEN THE SYSTEM REACHES ITS LIMIT?',copy:'Preserve escalation rules, handoff conditions, authority boundaries, fallback behavior, customer notices, and evidence that the chatbot does not silently exceed its declared scope.'},
];

const steps=[
  {title:'Define the chatbot’s actual authority',copy:'Separate answering, recommending, drafting, deciding, approving, executing and escalating. The legal and operational risk changes when the system moves from conversation into consequence.'},
  {title:'Bind the transparency notice to the deployed version',copy:'Record the exact disclosure language, interface location, deployment date, language/localization state and system version so the business can show what customers actually saw.'},
  {title:'Preserve escalation and human-oversight evidence',copy:'Keep the rules for handoff, override, complaint handling, restricted actions, blocked topics and exception handling—plus evidence that those controls were active for the relevant deployment.'},
  {title:'Revalidate after model, prompt or workflow changes',copy:'A model swap, new tool access, new sales function, new decision authority, changed disclosure or altered customer workflow can invalidate yesterday’s governance position.'},
];

const faqs=[
  {q:'Does the EU AI Act require chatbots to tell users they are AI?',a:'Article 50 requires providers of certain AI systems intended to interact directly with natural persons to design and develop them so people are informed that they are interacting with AI, unless this is obvious from the circumstances and context.'},
  {q:'When did the Article 50 transparency obligations start applying?',a:'They apply from 2 August 2026. The Commission published final implementation guidelines in July 2026 to clarify scope, concepts, exemptions and practical compliance.'},
  {q:'Is a privacy policy or terms page enough for chatbot disclosure?',a:'Not necessarily. The relevant question is whether the person is effectively informed in the interaction context. Businesses should preserve evidence of the actual notice, interface, timing, version and deployment state.'},
  {q:'What if the chatbot can take actions for the customer?',a:'Then governance should not stop at disclosure. The business should define what the bot can decide or execute, what requires human approval, what must be escalated, and what evidence supports those authority boundaries.'},
  {q:'Do all customer-service chatbots become high-risk AI?',a:'No. A customer-service chatbot is not automatically high-risk simply because it interacts with customers. High-risk classification depends on the system’s intended purpose and Article 6/Annex I/Annex III conditions.'},
  {q:'Does TA-14 certify a chatbot as compliant?',a:'No. TA-14 can preserve the system identity, disclosure evidence, scope, authority, escalation controls, changes and revalidation history. It does not itself provide legal advice, conformity assessment, certification or regulatory approval.'},
];

export default function CustomerServiceAiPage(){return <SeoAcquisitionPage
  eyebrow="EU AI ACT · ARTICLE 50 · CUSTOMER SERVICE AI"
  title="YOUR CHATBOT TALKS TO CUSTOMERS."
  accent="CAN YOU PROVE HOW IT WAS GOVERNED?"
  intro="Customer-facing AI creates an immediate transparency question—and sometimes a deeper authority problem. Businesses need to know what the bot tells people, what it is allowed to do, when a human must take over, and whether those controls still match the current model and workflow."
  sourceLabel="European Commission · Article 50 Transparency Guidelines"
  sourceHref="https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems"
  sourceNote="The Commission’s final Article 50 guidelines were published on 20 July 2026. The transparency obligations apply from 2 August 2026 and include requirements for providers of directly interactive AI systems to ensure people are explicitly informed when they are interacting with AI, subject to the Regulation’s exceptions."
  cards={cards}
  steps={steps}
  faqs={faqs}
  classifierHref="/eu-ai-act/classifier?intent=customer-service-ai"
  workspaceHref="/eu-ai-act/commercial"
  workspaceLabel="SEE GOVERNANCE PLANS →"
/>}
