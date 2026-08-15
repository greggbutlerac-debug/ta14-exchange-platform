import type {Metadata} from 'next';
import SeoAcquisitionPage from '../components/SeoAcquisitionPage';

export const metadata:Metadata={
 title:'EU AI Act Article 50 Compliance | Transparency Requirements',
 description:'Understand EU AI Act Article 50 transparency duties for AI interaction disclosure, synthetic-content marking, biometric and emotion-recognition notices, deepfakes and public-interest text. Start with a free system classification.',
 alternates:{canonical:'/eu-ai-act/article-50-compliance'},
 keywords:['EU AI Act Article 50 compliance','Article 50 AI Act','AI transparency requirements','chatbot disclosure EU AI Act','deepfake disclosure AI Act','AI generated content labeling EU'],
 openGraph:{title:'EU AI Act Article 50 Compliance | TA-14',description:'Determine which Article 50 transparency route may apply, what evidence supports it, and what remains unresolved.',url:'/eu-ai-act/article-50-compliance',type:'website'}
};

export default function Page(){return <SeoAcquisitionPage
 eyebrow="EU AI ACT · ARTICLE 50 TRANSPARENCY"
 title="ARTICLE 50 IS NOW APPLYING."
 accent="CAN YOU SHOW WHAT YOUR SYSTEM DOES?"
 intro="Article 50 creates transparency duties for several kinds of AI interaction and AI-generated or manipulated content. The operational question is not only whether a disclosure exists, but whether the organization can identify the applicable route, preserve the implementation evidence and revalidate it when the system changes."
 sourceLabel="European Commission · Article 50 transparency guidance"
 sourceHref="https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems"
 sourceNote="The European Commission published guidance on Article 50 transparency obligations in July 2026. The relevant Article 50 obligations began applying on 2 August 2026."
 classifierHref="/eu-ai-act/classifier?source=article-50-compliance"
 workspaceHref="/eu-ai-act/article-50"
 workspaceLabel="OPEN ARTICLE 50 WORKSPACE →"
 cards={[
  {title:'Direct AI interaction',copy:'Determine whether natural persons interact directly with the AI system and whether the applicable disclosure route is triggered or an exception may apply.'},
  {title:'Synthetic-content marking',copy:'For covered AI-generated or manipulated audio, image, video or text, preserve how machine-readable marking and detectability are implemented and tested where required.'},
  {title:'Biometric or emotion-recognition notice',copy:'Identify whether a deployment uses covered biometric categorisation or emotion-recognition functionality and preserve the affected-person notice pathway and any exception analysis.'},
  {title:'Deepfakes and public-interest text',copy:'For relevant deployer uses, preserve content classification, disclosure placement, editorial-control facts, publication chronology and exception reasoning.'},
 ]}
 steps={[
  {title:'Identify the system and actor',copy:'Record the system, version, intended purpose, deployment context and whether the organization is acting as provider, deployer or another regulated actor.'},
  {title:'Select the Article 50 route',copy:'Separate Article 50(1), 50(2), 50(3) and 50(4) questions instead of collapsing them into one generic transparency checkbox.'},
  {title:'Bind the evidence',copy:'Preserve screenshots, marking architecture, detectability testing, notice wording, exception analysis, editorial-control facts and version history where relevant.'},
  {title:'Revalidate after change',copy:'A model, interface, content pipeline, deployment or source-state change can make yesterday’s evidence insufficient even if the historical record remains true.'},
 ]}
 faqs={[
  {q:'When did Article 50 start applying?',a:'The Article 50 transparency obligations covered by the current Commission guidance began applying on 2 August 2026. Applicability still depends on the specific system, actor, use and relevant exceptions.'},
  {q:'Does every chatbot need the same disclosure?',a:'No. The correct analysis depends on the system, the interaction, the actor and the applicable exception or boundary. A generic chatbot label is not a substitute for a system-specific determination.'},
  {q:'Does adding a disclosure prove compliance?',a:'No. A disclosure can be one piece of evidence. The organization may still need to support applicability, timing, placement, wording, marking, detectability, exceptions and continuing validity.'},
  {q:'Can TA-14 certify Article 50 compliance automatically?',a:'No. TA-14 can structure classification, evidence, gaps, review and revalidation. Software access does not itself constitute legal advice, regulatory approval, conformity assessment or certification.'},
 ]}
/>}
