import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
 title:'EU AI Act Compliance for Chatbots and AI Assistants',
 description:'Determine whether an AI chatbot or assistant may trigger EU AI Act transparency duties, what evidence to preserve, and how to revalidate when the interface or model changes.',
 alternates:{canonical:'/eu-ai-act/chatbots'},
 keywords:['EU AI Act chatbot compliance','AI chatbot disclosure EU','EU AI Act AI assistant','Article 50 chatbot disclosure','chatbot transparency requirements Europe'],
 openGraph:{title:'EU AI Act Compliance for Chatbots | TA-14',description:'Classify an AI chatbot or assistant, map the Article 50 transparency route, preserve disclosure evidence and track change.',url:'/eu-ai-act/chatbots',type:'website'}
};

export default function Page(){return <SeoAcquisitionPage
 eyebrow="EU AI ACT · CHATBOTS & AI ASSISTANTS"
 title="DOES YOUR CHATBOT NEED"
 accent="AN EU AI ACT DISCLOSURE?"
 intro="AI chatbots and assistants are a practical Article 50 question for many businesses now. The key is not simply whether a bot exists, but whether natural persons interact directly with the AI system, what role the organization holds, whether an exception applies, what disclosure is implemented and whether the evidence still matches the deployed version."
 sourceLabel="European Commission · Article 50 transparency guidance"
 sourceHref="https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems"
 sourceNote="The Commission’s Article 50 guidance addresses transparency obligations for providers and deployers of relevant AI systems. The applicable Article 50 transparency rules began applying on 2 August 2026."
 classifierHref="/eu-ai-act/classifier?source=chatbots"
 workspaceHref="/eu-ai-act/article-50"
 workspaceLabel="OPEN ARTICLE 50 WORKSPACE →"
 cards={[
  {title:'Customer-service chatbots',copy:'Identify whether customers are interacting directly with AI and preserve the disclosure timing, wording, placement, interface version and any applicable exception analysis.'},
  {title:'AI copilots and assistants',copy:'Do not assume an internal or embedded assistant is outside scope. Record who interacts with it, in what context, under whose authority and for what intended purpose.'},
  {title:'White-label and vendor chatbots',copy:'If another provider supplies the model or application, separate provider and deployer responsibilities instead of treating the vendor contract as the compliance determination.'},
  {title:'Changing models and interfaces',copy:'A new model, UI, deployment mode or customer journey can change the factual basis behind a prior transparency determination and trigger revalidation.'},
 ]}
 steps={[
  {title:'Identify the deployed chatbot',copy:'Record the product, model or service, version, interface, intended purpose, audience, geography and deployment owner.'},
  {title:'Determine actor and interaction route',copy:'Establish whether the organization is acting as provider, deployer or another actor and whether natural persons directly interact with the AI system.'},
  {title:'Preserve disclosure evidence',copy:'Keep the disclosure wording, screenshot or interface capture, timing, placement, exception analysis and version linkage as bounded evidence.'},
  {title:'Revalidate after material change',copy:'Recheck the route when the model, vendor, interface, intended purpose, user population or official source state changes.'},
 ]}
 faqs={[
  {q:'Do all chatbots need the same EU AI Act disclosure?',a:'No. The applicable route depends on the system, actor, interaction context and relevant exceptions. The safe operational approach is to preserve a system-specific determination and its evidence.'},
  {q:'Is a small “AI” badge enough?',a:'A badge may be part of an implementation, but the legal and evidentiary question is broader: what obligation applies, when the person is informed, how clearly, what exception may apply and whether the implementation matches the current system.'},
  {q:'What if our chatbot uses a third-party model?',a:'Third-party technology does not eliminate the need to determine your own role and obligations. Provider, deployer and downstream relationships should be recorded separately.'},
  {q:'Can we start free?',a:'Yes. Use the free classifier to establish the chatbot, intended purpose, actor role, EU exposure and unresolved facts before selecting a paid evidence workspace or requesting a readiness review.'},
 ]}
/>}
